// Program 1: Multithreading
// Two worker threads run at the same time as the main thread.
// Compile: g++ -std=c++20 1_thread.cpp -o 1_thread

#include <thread>
#include <iostream>
#include <format>
#include <chrono>

using namespace std::chrono_literals;

// The job each worker thread runs
void Worker(int id)
{
    for (int step = 1; step <= 3; ++step)
    {
        std::cout << std::format("Worker {}: step {}\n", id, step);
        std::this_thread::sleep_for(500ms); // pretend to do some work
    }
    std::cout << std::format("Worker {}: finished\n", id);
}

int main()
{
    std::cout << "Main: starting 2 worker threads\n";

    // Creating a jthread starts it immediately
    std::jthread worker1(Worker, 1);
    std::jthread worker2(Worker, 2);

    std::cout << "Main: workers are running, main keeps going\n";

    // Thread synchronization: main waits until both workers are done
    worker1.join();
    worker2.join();

    std::cout << "Main: all workers finished, exiting\n";
    return 0;
}
