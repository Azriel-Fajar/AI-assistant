// Program 2: Mutex
// Two threads add to the same shared counter.
// Without a mutex the result is wrong. With a mutex it is correct.
// Compile: g++ -std=c++20 2_mutex.cpp -o 2_mutex
// (Do NOT add -O2. The optimizer can hide the bug in the "without mutex" test.)

#include <thread>
#include <mutex>
#include <iostream>

const int TIMES = 1000000;

int counter = 0;  // shared variable, both threads use it
std::mutex counterMutex;  // protects counter

// NOT safe: both threads can change counter at the same moment
void AddWithoutMutex()
{
    for (int i = 0; i < TIMES; ++i)
        counter++;
}

// Safe: only the thread holding the mutex can change counter
void AddWithMutex()
{
    for (int i = 0; i < TIMES; ++i)
    {
        counterMutex.lock();    // acquire: other threads wait here
        counter++;              // critical section
        counterMutex.unlock();  // release: next thread can enter
    }
}

int main()
{
    // Test 1: without mutex
    counter = 0;
    std::jthread a(AddWithoutMutex);
    std::jthread b(AddWithoutMutex);
    a.join();
    b.join();
    std::cout << "Without mutex: " << counter << " (expected " << TIMES * 2 << ")\n";

    // Test 2: with mutex
    counter = 0;
    std::jthread c(AddWithMutex);
    std::jthread d(AddWithMutex);
    c.join();
    d.join();
    std::cout << "With mutex:    " << counter << " (expected " << TIMES * 2 << ")\n";

    return 0;
}
