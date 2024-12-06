import random
import json

def generate_arithmetic():
    operations = ['+', '-', '*', '/']
    num1 = random.randint(1, 100)
    num2 = random.randint(1, 100)
    operation = random.choice(operations)

    if operation == '/' and num2 != 0:
        answer = round(num1 / num2, 2)
        question_text = f"Сколько будет {num1} ÷ {num2} (округлить до двух знаков)?"
        difficulty = 'normal'
    elif operation == '*':
        answer = num1 * num2
        question_text = f"Сколько будет {num1} × {num2}?"
        difficulty = 'hard' if num1 > 20 or num2 > 20 else 'normal'
    elif operation == '+':
        answer = num1 + num2
        question_text = f"Сколько будет {num1} + {num2}?"
        difficulty = 'easy'
    else:  # '-'
        answer = num1 - num2
        question_text = f"Сколько будет {num1} - {num2}?"
        difficulty = 'easy'

    return {"text": question_text, "answer": str(answer), "difficulty": difficulty}


def generate_logic():
    sequence = [random.randint(1, 20) for _ in range(4)]
    step = random.randint(1, 10)
    sequence = [sequence[0] + i * step for i in range(4)]
    missing_index = random.randint(0, 3)
    correct_answer = sequence[missing_index]
    sequence[missing_index] = "?"

    question_text = f"Найдите пропущенное число в последовательности: {', '.join(map(str, sequence))}"
    difficulty = 'normal' if step < 5 else 'hard'

    return {"text": question_text, "answer": str(correct_answer), "difficulty": difficulty}


def generate_equation():
    x = random.randint(1, 50)
    offset = random.randint(1, 20)
    operation = random.choice(['+', '-'])

    if operation == '+':
        result = x + offset
        question_text = f"Решите уравнение: x + {offset} = {result}. Найдите x."
    else:
        result = x - offset
        question_text = f"Решите уравнение: x - {offset} = {result}. Найдите x."

    difficulty = 'hard' if x > 20 else 'normal'

    return {"text": question_text, "answer": str(x), "difficulty": difficulty}


def generate_comparison():
    numbers = [random.randint(1, 100) for _ in range(4)]
    correct_answer = max(numbers)
    question_text = f"Какое число самое большое: {', '.join(map(str, numbers))}?"
    difficulty = 'easy'

    return {"text": question_text, "answer": str(correct_answer), "difficulty": difficulty}


def generate_custom_puzzle():
    puzzles = [
        {"text": "У фермера есть куры и кролики. Всего у них 20 голов и 48 ног. Сколько у фермера кур?", "answer": "8", "difficulty": "hard"},
        {"text": "Три друга делят 12 яблок поровну. Сколько яблок достанется каждому другу?", "answer": "4", "difficulty": "easy"},
        {"text": "В комнате горят 5 свечей. 2 из них задул ветер. Сколько свечей осталось?", "answer": "2", "difficulty": "easy"}
    ]
    return random.choice(puzzles)


def generate_questions(num_questions):
    question_types = [generate_arithmetic, generate_logic, generate_equation, generate_comparison, generate_custom_puzzle]
    questions = []

    for _ in range(num_questions):
        question = random.choice(question_types)()
        question["image"] = f"https://i.sstatic.net/HZYYT.jpg"
        questions.append(question)

    return questions


def save_to_file(questions, filename):
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(questions, file, indent=4, ensure_ascii=False)
    print(f"{len(questions)} загадок сохранено в {filename}")


if __name__ == "__main__":
    num_questions = int(input("Сколько загадок создать? "))
    filename = "questions.json"
    questions = generate_questions(num_questions)
    save_to_file(questions, filename)
