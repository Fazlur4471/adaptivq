import json
import random
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)

def normalize(text):
    return text.strip().lower()


with open('Goodquestions.json', 'r') as f:
    rag_data = json.load(f)

with open('Goodanswers.json', 'r') as f:
    answers_data = json.load(f)

normalized_answers = {
    normalize(item["question"]): item["answer"]
    for item in answers_data.get("interview_questions", [])
}


genai.configure(api_key='Your_Gemini_Key')  


def select_random_questions(rag_data, num_questions=5, category=None, difficulty=None):
    filtered_questions = rag_data
    if difficulty:
        filtered_questions = [q for q in filtered_questions if q['difficulty'] == difficulty]

    if len(filtered_questions) < num_questions:
        raise ValueError(f"Not enough questions available with the specified criteria.")

    return random.sample(filtered_questions, num_questions)


def evaluate_answer_with_gemini(question, user_answer, correct_answer):
    prompt = f"""
    Question: {question}
    Correct Answer: {correct_answer}
    User's Answer: {user_answer}

    Evaluate if the user's answer is correct and provides a similar meaning to the correct answer. 
    Provide a brief explanation and a score (0-100).
    """

    try:
        model = genai.GenerativeModel(model_name="gemini-2.0-flash")  # Specify model name
        response = model.generate_content(prompt)
        evaluation = response.text.strip()
        return evaluation
    except Exception as e:
        return f"Evaluation failed: {str(e)}"


def compare_and_evaluate_answers(selected_questions, user_answers, answers_data):
    results = []
    
    answer_list = answers_data['interview_questions']
    
    for i, question in enumerate(selected_questions):
        correct_answer = next((ans['answer'] for ans in answer_list if ans['question'] == question['question']), None)
        
        if correct_answer:
            user_answer = user_answers[i]
            evaluation = evaluate_answer_with_gemini(question['question'], user_answer, correct_answer)
            results.append({
                'question': question['question'],
                'user_answer': user_answer,
                'correct_answer': correct_answer,
                'evaluation': evaluation
            })
        else:
            results.append({
                'question': question['question'],
                'user_answer': user_answers[i],
                'correct_answer': 'Not available',
                'evaluation': 'Correct answer not found in answers.json'
            })
    return results


@app.route('/get_test_questions', methods=['GET'])
def get_test_questions():
    difficulty = request.args.get('difficulty')
    num_questions = int(request.args.get('num_questions', 5))

    try:
        selected_questions = select_random_questions(rag_data, num_questions, difficulty)
        questions_list = [{'question': q['question'],'difficulty': q['difficulty']} for q in selected_questions]
        return jsonify(questions_list)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400



@app.route('/evaluate_exam', methods=['POST'])
def evaluate_exam():
    data = request.json
    user_answers = data['answers']
    questions = data['questions']

    with open('Goodanswers.json', 'r') as f:
        answers_data = json.load(f)

    
    normalized_answers = {
        normalize(item["question"]): item["answer"]
        for item in answers_data.get("interview_questions", [])
    }

    evaluation_result = []
    for i, question in enumerate(questions):
        question_text = question['question'] if isinstance(question, dict) else question
        user_answer = user_answers[i]
        normalized_question = normalize(question["question"])
        
        correct_answer = normalized_answers.get(normalized_question, "Not available")

        if correct_answer != "Not available":
            evaluation = evaluate_answer_with_gemini(question_text, user_answer, correct_answer)
        else:
            evaluation = "Correct answer not found in answers.json"

        evaluation_result.append({
            "question": question_text,
            "user_answer": user_answer,
            "correct_answer": correct_answer,
            "evaluation": evaluation
        })

    return jsonify(evaluation_result)

if __name__ == '__main__':
    app.run(debug=True)
