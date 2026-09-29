// Program 4: Coroutine
// A coroutine is a function that can pause (co_yield) and continue later.
// Everything here runs in ONE thread. The coroutine and main take turns.
// Compile: g++ -std=c++23 4_coroutine.cpp -o 4_coroutine
// (std::generator is a C++23 helper that makes coroutines easy to write)

#include <generator>
#include <iostream>

// A coroutine that counts down from "start"
std::generator<int> Countdown(int start)
{
    std::cout << "  [coroutine] started\n";
    for (int n = start; n > 0; --n)
    {
        std::cout << "  [coroutine] giving " << n << ", then pausing\n";
        co_yield n;  // PAUSE here and send n back to main
        std::cout << "  [coroutine] resumed\n";
    }
    std::cout << "  [coroutine] finished\n";
}

int main()
{
    std::cout << "[main] calling the coroutine\n";

    // Each loop step resumes the coroutine until its next co_yield
    for (int value : Countdown(3))
    {
        std::cout << "[main] received " << value << ", doing my own work\n";
    }

    std::cout << "[main] done\n";
    return 0;
}
