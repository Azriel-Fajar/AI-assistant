# TC631 Operating System - Assignment #1: Thread and Multithreading

Instructor: Theophilus Wellem. Deadline: before 30 September 2026 (submit on FLEARN).
Task: simple programs that show multithreading, mutex, semaphore, coroutine. Report = code + explanation.

Language: C++ (same as the lecturer's slides). Compiler: g++ 15.2.

## Files

| File | Concept | Compile |
|---|---|---|
| `1_thread.cpp` | Multithreading | `g++ -std=c++20 1_thread.cpp -o 1_thread` |
| `2_mutex.cpp` | Mutex | `g++ -std=c++20 2_mutex.cpp -o 2_mutex` (no `-O2`) |
| `3_semaphore.cpp` | Semaphore | `g++ -std=c++20 3_semaphore.cpp -o 3_semaphore` |
| `4_coroutine.cpp` | Coroutine | `g++ -std=c++23 4_coroutine.cpp -o 4_coroutine` |

Run with `./1_thread` (Linux) or `.\1_thread.exe` (Windows).

**Report (submission):** `Task_1_Thread_Multithreading_672025121.pdf`. Text lives in `report/report.template.html`. Rebuild with `node projects/os-assignment-1-thread/report/build.js` from the JARVIS root: it compiles and runs every program, checks the output, puts the real code and output into the template, and prints the PDF.

Why `std::format`? When many threads print at once, `cout << "a" << x << "b"` can get mixed up between threads, because each `<<` is a separate print. `std::format` builds the whole line first, so it is printed in one go.

---

## 1. Multithreading (`1_thread.cpp`)

**Idea:** the main thread starts 2 worker threads. All 3 run at the same time.

**How it works:**
1. `Worker(int id)` is the job for each thread. It prints 3 steps and sleeps 0.5 s between them.
2. `std::jthread worker1(Worker, 1);` creates a thread and it **starts right away**, running `Worker(1)`.
3. Same for `worker2`. Now there are 3 threads: main, worker 1, worker 2.
4. Main does not wait. It prints "workers are running" immediately.
5. `worker1.join()` = main **waits** until worker 1 ends. This is the simplest form of thread synchronization (slide 8: one thread waits on another).
6. After both joins, main prints the last line and exits.

**Output:**
```
Main: starting 2 worker threads
Main: workers are running, main keeps going
Worker 1: step 1
Worker 2: step 1
Worker 2: step 2
Worker 1: step 2
Worker 1: step 3
Worker 2: step 3
Worker 1: finished
Worker 2: finished
Main: all workers finished, exiting
```

**What to notice:**
- Worker 1 and Worker 2 steps are mixed. That proves they run in parallel.
- The order changes each run (sometimes 2 before 1). The OS scheduler decides who runs first.
- Total time is about 1.5 s, not 3 s, because both workers sleep at the same time.
- Without `join()`, main could reach the end before the workers finish. (`jthread` also joins by itself when it is destroyed, but writing `join()` makes the waiting clear.)

---

## 2. Mutex (`2_mutex.cpp`)

**Idea:** 2 threads each add 1 to the same shared `counter`, 1,000,000 times. Expected total = 2,000,000.

**The problem (race condition):** `counter++` looks like one step but the CPU does 3:
1. read `counter` from memory
2. add 1
3. write it back

If both threads read the same value (say 10) at the same time, both write 11. One `+1` is lost.

```
Thread A: read 10
Thread B: read 10
Thread A: write 11
Thread B: write 11   <- should be 12, one add is lost
```

**The fix:** a mutex around `counter++`.
- `counterMutex.lock()` = acquire. If another thread holds it, this thread **waits** (the OS puts it to sleep).
- `counter++` = the **critical section**. Only one thread can be here at a time.
- `counterMutex.unlock()` = release. The next waiting thread can enter.
- Ownership: only the thread that locked the mutex may unlock it (slide 16).

**Output (numbers change each run):**
```
Without mutex: 1183873 (expected 2000000)
With mutex:    2000000 (expected 2000000)
```

**What to notice:**
- Without mutex: always wrong, and a different wrong number every run.
- With mutex: always exactly 2,000,000.
- Compile without `-O2`. With `-O2` the compiler turns the loop into one big add, so the bug stops showing (tested: gives 2,000,000 even without mutex). The bug is still there, it is just hidden.
- In real code people use `std::lock_guard<std::mutex> guard(counterMutex);` which unlocks automatically. Here `lock()`/`unlock()` is written out so each step is visible.

---

## 3. Semaphore (`3_semaphore.cpp`)

**Idea:** a parking lot with **2 spots**. **5 cars** (5 threads) want to park. The semaphore makes sure at most 2 cars are parked at the same time.

**How it works:**
1. `std::counting_semaphore<2> parkingSpots(2);` = a counter that starts at 2 (2 free spots).
2. Each car calls `parkingSpots.acquire();`
   - count > 0: count goes down by 1, car parks.
   - count = 0: car **waits** until someone releases.
3. Car stays parked 1 s (`sleep_for(1s)`).
4. `parkingSpots.release();` = count goes up by 1. One waiting car can now park.
5. `main` creates 5 cars, 50 ms apart, then `join()`s them all.

**Output:**
```
Car 1: waiting for a spot
Car 1: PARKED
Car 2: waiting for a spot
Car 2: PARKED
Car 3: waiting for a spot
Car 4: waiting for a spot
Car 5: waiting for a spot
Car 1: leaving
Car 5: PARKED
Car 2: leaving
Car 4: PARKED
Car 5: leaving
Car 3: PARKED
Car 4: leaving
Car 3: leaving
All cars are done
```

**What to notice:**
- Cars 3, 4, 5 have to wait. A new car parks only right after another one leaves.
- Never more than 2 cars parked at once.
- Car 5 parked before car 3 even though car 3 came first. A semaphore does **not** guarantee first come, first served.
- Mutex vs semaphore:
  - Mutex = 1 thread at a time, has an owner (only the locker can unlock).
  - Semaphore = up to N threads, no owner (any thread can `release()`).
  - A semaphore with N = 1 is a **binary semaphore** (`std::binary_semaphore`), almost like a mutex but without ownership.
- Real use: limit a database connection pool, limit how many downloads run at once.

---

## 4. Coroutine (`4_coroutine.cpp`)

**Idea:** a coroutine is a function that can **pause** in the middle and **continue** later from the same spot. There is only **one thread** here. The coroutine and `main` take turns (cooperative multitasking).

**How it works:**
1. `std::generator<int> Countdown(int start)` is a coroutine because it uses `co_yield`. `std::generator` (C++23) handles all the setup, which is why the code is short.
2. `co_yield n;` = send `n` back to main and **pause right here**. Local variables (like `n`) are kept.
3. In main, `for (int value : Countdown(3))`:
   - each loop step **resumes** the coroutine,
   - it runs until the next `co_yield`,
   - the value comes back as `value`, and main runs its loop body.
4. When the coroutine's function ends, the loop ends.

**Output:**
```
[main] calling the coroutine
  [coroutine] started
  [coroutine] giving 3, then pausing
[main] received 3, doing my own work
  [coroutine] resumed
  [coroutine] giving 2, then pausing
[main] received 2, doing my own work
  [coroutine] resumed
  [coroutine] giving 1, then pausing
[main] received 1, doing my own work
  [coroutine] resumed
  [coroutine] finished
[main] done
```

**What to notice:**
- Control goes back and forth: coroutine, main, coroutine, main.
- "resumed" is printed right after main's line. The coroutine continues from the exact line after `co_yield`, not from the start.
- The order is **always the same** every run. No OS scheduler is involved. The coroutine decides itself when to pause (cooperative). Threads are the opposite: the OS can interrupt them at any time (preemptive, slide 19).
- No mutex needed, because only one thread runs.

---

## Summary

| | Thread | Mutex | Semaphore | Coroutine |
|---|---|---|---|---|
| What it is | Separate execution path | Lock for 1 thread | Counter for N threads | Function that can pause |
| Runs in parallel? | Yes | (sync tool) | (sync tool) | No, one thread takes turns |
| Who switches? | OS (preemptive) | - | - | The code itself (`co_yield`) |
| C++ | `std::jthread` | `std::mutex` | `std::counting_semaphore` | `co_yield`, `std::generator` |
| Program | 1 | 2 | 3 | 4 |
