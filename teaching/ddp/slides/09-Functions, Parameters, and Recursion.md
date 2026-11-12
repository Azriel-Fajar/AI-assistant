# Functions, Parameters, and Recursion

**Dasar-Dasar Pemrograman** · Lab Session

- **Lecturer:** THEOPHILUS YOHANIS HERMANUS WELLEM,, S.T., M.S., Ph.D.
- **Teaching Assistants:** Azriel Fajar Wicaksono (672025121), Cynthia Elena Gunadi (672025001)
- **Source:** https://www.w3schools.com/c/c_functions.php (Functions, Parameters, Declaration, Pass By Reference, Recursion)

---

## 02. Agenda

1. What a function is
2. Parameters and return values
3. Pass by value vs pass by reference
4. Recursion (short)
5. Code reading drill + Assignment 2

*Speaker notes: Most of the time goes to functions and by value vs by reference. Recursion is a short preview, about 15 minutes.*

---

## 03. What Is a Function?

- A block of code that only runs when it is **called**.
- Write it once, use it many times.
- You already use functions: `main()` and `printf()`.

**Analogy:** a function is a recipe. You write it once, then "cook" it whenever you need it.

*Speaker notes: Ask the room how many times they copy-pasted the same printf block last week. That repetition is what functions fix.*

---

## 04. Create and Call a Function

```c
#include <stdio.h>

void myFunction() {
    printf("I just got executed!\n");
}

int main() {
    myFunction();
    myFunction();
    myFunction();
    return 0;
}
```

- `void` = the function returns nothing.
- A function does nothing until you call it: `myFunction();`

Output:

```
I just got executed!
I just got executed!
I just got executed!
```

*Speaker notes: Point out the call needs parentheses and a semicolon. Forgetting the parentheses is a common week-one mistake.*

---

## 05. Parameters and Arguments

```c
#include <stdio.h>

void myFunction(char name[]) {
    printf("Hello %s\n", name);
}

int main() {
    myFunction("Liam");
    myFunction("Jenny");
    myFunction("Anja");
    return 0;
}
```

- **Parameter:** the variable in the function definition (`name`).
- **Argument:** the value you send when calling (`"Liam"`).

Output:

```
Hello Liam
Hello Jenny
Hello Anja
```

*Speaker notes: Parameter = the empty box. Argument = what you put in the box. Same function, different results.*

---

## 06. Multiple Parameters

```c
#include <stdio.h>

void calculateSum(int x, int y) {
    int sum = x + y;
    printf("The sum of %d + %d is: %d\n", x, y, sum);
}

int main() {
    calculateSum(5, 3);
    calculateSum(8, 2);
    calculateSum(15, 15);
    return 0;
}
```

- Separate parameters with a comma.
- Number of arguments must match the number of parameters.
- Order matters: first argument goes to the first parameter.

Output:

```
The sum of 5 + 3 is: 8
The sum of 8 + 2 is: 10
The sum of 15 + 15 is: 30
```

*Speaker notes: Ask what happens if they call calculateSum(5). Answer: compile error, too few arguments.*

---

## 07. Return Values

```c
#include <stdio.h>

int myFunction(int x, int y) {
    return x + y;
}

int main() {
    int result = myFunction(5, 3);
    printf("Result is = %d", result);
    return 0;
}
```

- Replace `void` with a type (`int`, `float`, ...) to send a value back.
- `return` sends the value back to whoever called the function.
- Store the result in a variable to use it later.

Output:

```
Result is = 8
```

*Speaker notes: Contrast with slide 06. That version only prints. This version gives the number back, so main can keep using it.*

---

## 08. Declaration vs Definition

```c
#include <stdio.h>

// Function declaration
int myFunction(int x, int y);

int main() {
    int result = myFunction(5, 3);
    printf("Result is = %d", result);
    return 0;
}

// Function definition
int myFunction(int x, int y) {
    return x + y;
}
```

- **Declaration:** name, return type, parameters. Ends with `;`.
- **Definition:** the body (the actual code).
- C must know a function exists **before** it is called.

*Speaker notes: This is the style required in Assignment 2. Declarations on top, main in the middle, definitions at the bottom.*

---

## 09. Pass By Value

```c
#include <stdio.h>

void addTen(int x) {
    x = x + 10;
}

int main() {
    int myNum = 5;
    addTen(myNum);
    printf("%d\n", myNum);  // 5
    return 0;
}
```

- The function gets a **copy** of the value.
- Changing the copy does not change the original.
- `myNum` stays `5`.

**Analogy:** you give a friend a photocopy of your notes. They scribble on it. Your original is untouched.

*Speaker notes: Ask the room to predict the output before revealing. Most will say 15. That surprise is the whole lesson.*

---

## 10. Pass By Reference

```c
#include <stdio.h>

void addTen(int *x) {
    *x = *x + 10;
}

int main() {
    int myNum = 5;
    addTen(&myNum);
    printf("%d\n", myNum);  // 15
    return 0;
}
```

- Parameter is a pointer: `int *x` stores an address.
- Call with `&`: `addTen(&myNum)` sends the address.
- Inside, `*x` **is** `myNum`, so the original changes.

**Analogy:** you give your friend your house address. They walk in and rearrange your actual room.

*Speaker notes: Connect to scanf("%d", &myNum). They have been passing by reference since week one without knowing it.*

---

## 11. Example: Swap Two Variables

```c
#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 5;
    int y = 10;
    swap(&x, &y);
    printf("x is %d, y is %d\n", x, y);  // x is 10, y is 5
    return 0;
}
```

| | By value | By reference |
| --- | --- | --- |
| Parameter | `int x` | `int *x` |
| Call | `f(num)` | `f(&num)` |
| Original changes? | No | Yes |

*Speaker notes: Without pointers, swap would only swap its own copies. Use by reference only when the function must change the original, or give back more than one result.*

---

## 12. Recursion

- A function that **calls itself**.
- Breaks a big problem into smaller copies of the same problem.
- Must have a **halting condition**, or it never stops (infinite recursion).

**Analogy:** Russian nesting dolls. Open one, there is a smaller one inside, until the smallest doll that does not open.

*Speaker notes: Keep this short. The halting condition is the one thing they must remember.*

---

## 13. Factorial

```c
#include <stdio.h>

int factorial(int n);

int main() {
    printf("Factorial of 5 is %d", factorial(5));
    return 0;
}

int factorial(int n) {
    if (n > 1) {
        return n * factorial(n - 1);
    } else {
        return 1;
    }
}
```

- `5! = 5 * 4 * 3 * 2 * 1 = 120`
- Halting condition: `n` is 1 or less, return 1.

Output:

```
Factorial of 5 is 120
```

*Speaker notes: Trace factorial(3) on the board: 3 * factorial(2), 2 * factorial(1), factorial(1) returns 1. Then multiply back up.*

---

## 14. Fibonacci and Power

```c
int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int power(int base, int exp) {
    if (exp == 0) {
        return 1;
    }
    return base * power(base, exp - 1);
}
```

- Fibonacci: 0, 1, 1, 2, 3, 5, 8, ... so `fibonacci(6)` = 8.
- Power: `power(2, 5)` = 2 * 2 * 2 * 2 * 2 = 32.

*Speaker notes: Same pattern every time. One if for the halting condition, one return that calls itself with a smaller input.*

---

## 15. Tower of Hanoi

Move all disks from A to C. One disk at a time. Never put a big disk on a small one.

```c
void hanoi(int n, char from, char to, char via) {
    if (n == 1) {
        printf("Move disk 1 from %c to %c\n", from, to);
        return;
    }
    hanoi(n - 1, from, via, to);
    printf("Move disk %d from %c to %c\n", n, from, to);
    hanoi(n - 1, via, to, from);
}
```

Output of `hanoi(3, 'A', 'C', 'B');`:

```
Move disk 1 from A to C
Move disk 2 from A to B
Move disk 1 from C to B
Move disk 3 from A to C
Move disk 1 from B to A
Move disk 2 from B to C
Move disk 1 from A to C
```

*Speaker notes: Idea only, no need to master it. Move the top n-1 out of the way, move the biggest disk, move the n-1 back on top. 3 disks = 7 moves.*

---

## 16. Code Reading Drill

```c
#include <stdio.h>

int main() {
    int score = 10;
    tripleIt(&score);
    printf("Score: %d\n", score)
    return 0;
}

void tripleIt(int x) {
    x = x * 3;
}
```

- Does this program run? Why or why not?
- There are **3 problems**. Find them.
- Follow-up: after fixing it, what does it print?

*Speaker notes: Answers (do not show on slide): (1) tripleIt is called before it is declared, add `void tripleIt(int *x);` above main. (2) Missing semicolon after printf. (3) Parameter is `int x` but receives `&score`, change to `int *x` and `*x = *x * 3;`. Fixed output: `Score: 30`. Extra question: if they "fix" it by removing `&` and keeping `int x`, it prints `Score: 10` because of pass by value. Verified on GCC 16: all 3 problems are compile errors. Older MinGW (GCC below 14) only warns on problems 1 and 3, so a student may get it to run with a wrong result.*

---

## 17. Assignment 2: Number Toolkit

Write a program with **at least 4 functions** (besides `main`):

| Function | Type |
| --- | --- |
| `int add(int a, int b)` returns a + b | By value |
| `int multiply(int a, int b)` returns a * b | By value |
| `void swap(int *a, int *b)` swaps the two numbers | By reference |
| `void doubleIt(int *x)` doubles the original number | By reference |

- Input two integers, then: print sum and product, swap and print, double `a` and print.
- Declarations above `main`, definitions below `main`.
- File name: `NIM_Assignment2.c`, submit to Google Classroom.
- Work in class. Not finished? Submit after class.

Expected output (input 4 and 7):

```
C:\Users\azriel>
Enter first number: 4
Enter second number: 7
Sum: 11
Product: 28
After swap: a = 7, b = 4
After doubleIt(a): a = 14
Press any key to continue . . .
```

*Speaker notes: Point them back to slides 07, 08, 10, and 11. Every piece they need is already on those slides.*

---

## 18. Credits

| Name | NIM |
| --- | --- |
| Azriel Fajar Wicaksono | 672025121 |
| Cynthia Elena Gunadi | 672025001 |

**Any questions?**

---

## Assistant Only: Assignment 2 Answer Key (not a slide)

Compiled and run on GCC 16 with input `4` and `7`. Output matches slide 17.

```c
#include <stdio.h>

int add(int a, int b);
int multiply(int a, int b);
void swap(int *a, int *b);
void doubleIt(int *x);

int main() {
    int a, b;

    printf("Enter first number: ");
    scanf("%d", &a);
    printf("Enter second number: ");
    scanf("%d", &b);

    printf("Sum: %d\n", add(a, b));
    printf("Product: %d\n", multiply(a, b));

    swap(&a, &b);
    printf("After swap: a = %d, b = %d\n", a, b);

    doubleIt(&a);
    printf("After doubleIt(a): a = %d\n", a);

    return 0;
}

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void doubleIt(int *x) {
    *x = *x * 2;
}
```

Grading checklist:
- 4+ functions besides main, at least 2 by value and 2 by reference.
- Uses `&` at the call and `*` inside for the by-reference functions.
- Declarations above main.
- Output correct for any two integers, not only 4 and 7.
- Correct file name `NIM_Assignment2.c`.
