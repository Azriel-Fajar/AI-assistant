# TC631 Operating System - Assignment #2: Thread Library in Linux and Windows

Instructor: Theophilus Wellem. Deadline: before 21 October 2026 (submit on FLEARN).
Task: convert the lecture's Pthreads example (1) to Windows API threads, (2) to C or C++ standard threads. Report = code + execution result + explanation.

## Files

| File | What | Compile |
|---|---|---|
| `0_pthread.c` | Lecturer's original Pthreads example, unchanged | `gcc -std=c23 0_pthread.c -o 0_pthread -pthread` |
| `1_winapi_thread.c` | Task 1: Win32 (`CreateThread`, `WaitForSingleObject`, `GetExitCodeThread`, `CloseHandle`) | `gcc -std=c23 1_winapi_thread.c -o 1_winapi_thread` |
| `2_std_thread.cpp` | Task 2: C++23 `std::jthread` | `g++ -std=c++23 2_std_thread.cpp -o 2_std_thread` |

All three print:
```
Hello from the Main Thread!
Hello from Worker Thread #1!
Worker thread returned: 10
```

**Report (submission):** `Task_2_Thread_Library_672025121.pdf`. Text lives in `report/report.template.html`. Rebuild with `node projects/os-assignment-2-thread-library/report/build.js` from the JARVIS root: compiles + runs every program 5x, checks output, fills template, prints PDF.

## Notes

- Task 2 is C++ not C: MSYS2 MinGW gcc has no `<threads.h>` (C11 threads). Build script proves it each run.
- `<print>` / `std::println` fails to link on this toolchain (ld exit 5). Use `std::cout << std::format(...)` instead.
- Win32 return value = thread exit code (32-bit DWORD), so no malloc. Avoid 259 (`STILL_ACTIVE`).
- `std::jthread` has no return value; result passed back via `std::ref`.
