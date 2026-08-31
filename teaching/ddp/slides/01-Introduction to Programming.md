# Introduction to Programming

**Dasar-Dasar Pemrograman** · Meeting 1 · Lab Session

- **Lecturer:** THEOPHILUS YOHANIS HERMANUS WELLEM,, S.T., M.S., Ph.D.
- **Teaching Assistants:** Azriel Fajar Wicaksono (672025121), Cynthia Elena Gunadi (672025001)

---

## 02. Meet Your Assistants

| Name | NIM |
| --- | --- |
| Azriel Fajar Wicaksono | 672025121 |
| Cynthia Elena Gunadi | 672025001 |

*Speaker notes: Short introductions. Say how you prefer to be reached and when you are in the lab.*

---

## 03. Course Syllabus

1. Introduction to programming and flowcharts
2. C program structure and how the compiler works
3. Identifiers, variables, constants, and data types
4. if and if-else branching
5. switch-case branching
6. for loops
7. while and do-while loops
8. Procedures
9. Functions
10. Parameters
11. Recursive functions
12. String functions
13. Integrated case study and final project

*Speaker notes: Point out where the midterm and final sit. Tell them topics build on each other, so a missed week is expensive.*

---

## 04. Class Rules

**Rule 01 — Late arrival: 15 minutes maximum**
Let the assistants know beforehand, by direct message or in the group chat.

**Rule 02 — Absences: 3 maximum**
More than that results in a grade of E.

*Speaker notes: Say these once, clearly, and hold to them. Confirm which group chat counts as notice.*

---

## 05. Agenda

1. Install VS Code
2. Set up the compiler
3. Intro to the C language
4. Flowchart basics
5. Learning resources

*Speaker notes: Set the shape of the session: two installs, then C and flowcharts. Roughly half the time goes to setup.*

---

## 06. What Is C?

**1972** — Created by **Dennis Ritchie**

- Runs close to the hardware.
- Foundation for later languages like C++, Java, and Python.

*Speaker notes: C is old on purpose. Point out that once they can read C, most modern syntax looks familiar.*

---

## 07. Basic Structure of a C Program

```c
#include <stdio.h>

int main() {
    printf("Hello World");
    return 0;
}
```

- `#include` brings in a library.
- `main()` is the program entry point.
- `return 0` is the exit signal.

*Speaker notes: Read the code out loud line by line. Every C program you write this semester keeps this skeleton.*

---

## 08. Editor vs Compiler

**VS Code**
- Where you write the code.
- Just a text editor.

**GCC Compiler**
- Turns your code into a program the computer can run.

You need both.

*Speaker notes: The most common confusion of week one. VS Code does not run anything by itself.*

---

## 09. Step 1: Install VS Code

1. Download from https://code.visualstudio.com
2. Run the installer, check **Add to PATH**
3. Open VS Code, go to the Extensions tab
4. Install the `C/C++` extension by Microsoft

*Speaker notes: Walk the room while they install. The PATH checkbox is the one people miss.*

---

## 10. Step 2: Install the Compiler (MinGW)

1. Download MinGW-w64 from https://winlibs.com
2. Extract it to `C:\mingw64`
3. Add `C:\mingw64\bin` to the system PATH
4. Open a new terminal and run `gcc --version`

If the version prints, the compiler is ready.

*Speaker notes: Editing the system PATH is the hard part. Have them close and reopen the terminal before testing.*

---

## 11. Step 3: Run Your First Program

1. Create a file named `hello.c`
2. Paste the hello world code
3. Open the terminal in VS Code (Ctrl + `)
4. Compile and run:

```bash
gcc hello.c -o hello
./hello
```

Expected output:

```
Hello World
```

*Speaker notes: Type the two commands on screen yourself first, then let them try. Explain -o names the output file.*

---

## 12. Flowchart Symbols

| Shape | Meaning |
| --- | --- |
| Oval | Start / End |
| Parallelogram | Input / Output |
| Rectangle | Process |
| Diamond | Decision (yes / no) |
| Arrow | Flow direction |

Flow always runs top to bottom, with one start point and one end point.

*Speaker notes: Five shapes cover everything this semester. Ask the room to name the shape as you point at each one.*

---

## 13. Flowchart Example: Even or Odd

```
            Start
              |
        Input number
              |
      number % 2 == 0?
        /            \
     yes              no
      |                |
 Print "Even"    Print "Odd"
      \                /
              |
             End
```

*Speaker notes: Trace two values through the chart, one even and one odd, before moving on.*

---

## 14. Resources

- https://learn-c.org
- https://www.w3schools.com/c
- https://www.programiz.com/c-programming
- https://code.visualstudio.com/docs/cpp/config-mingw

**Any questions?**

*Speaker notes: Tell them which one you would start with, and confirm how to reach you before next week.*
