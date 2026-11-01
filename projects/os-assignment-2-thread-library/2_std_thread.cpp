// Program 2: C++ standard thread library
// The pthread example converted to std::jthread (C++20/23).
// Compile: g++ -std=c++23 2_std_thread.cpp -o 2_std_thread

#include <thread>
#include <iostream>
#include <format>
#include <functional>

// A std::jthread function can have any parameters and types.
// The result is written into a reference, so no malloc and no void* casts.
void thread_runner(int thread_num, int& result) {
    std::cout << std::format("Hello from Worker Thread #{}!\n", thread_num);

    result = thread_num * 10; // Pass the return value back to main
}

int main() {
    int thread_arg = 1;
    int thread_return_val = 0;

    // 1. Create the thread (Function, Arguments). The thread starts immediately.
    //    std::ref passes thread_return_val by reference instead of copying it.
    //    If creation fails, std::system_error is thrown.
    std::jthread worker_thread(thread_runner, thread_arg, std::ref(thread_return_val));

    std::cout << "Hello from the Main Thread!\n";

    // 2. Join the thread (Wait for it to finish)
    worker_thread.join();

    // 3. Process the returned data
    std::cout << std::format("Worker thread returned: {}\n", thread_return_val);

    return 0; // Nothing to free: no heap memory, no handle to close
}
