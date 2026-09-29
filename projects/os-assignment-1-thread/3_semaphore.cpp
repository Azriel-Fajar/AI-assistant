// Program 3: Semaphore
// A parking lot has only 2 spots, but 5 cars (threads) want to park.
// The semaphore lets at most 2 cars in at the same time.
// Compile: g++ -std=c++20 3_semaphore.cpp -o 3_semaphore

#include <thread>
#include <semaphore>
#include <iostream>
#include <format>
#include <chrono>
#include <vector>

using namespace std::chrono_literals;

// Counting semaphore, starts with 2 free spots
std::counting_semaphore<2> parkingSpots(2);

void Car(int id)
{
    std::cout << std::format("Car {}: waiting for a spot\n", id);

    parkingSpots.acquire();  // take a spot (count - 1). If count is 0, wait here.
    std::cout << std::format("Car {}: PARKED\n", id);

    std::this_thread::sleep_for(1s);  // stay parked for a while

    std::cout << std::format("Car {}: leaving\n", id);
    parkingSpots.release();  // give the spot back (count + 1)
}

int main()
{
    std::vector<std::jthread> cars;
    for (int id = 1; id <= 5; ++id)
    {
        cars.emplace_back(Car, id);
        std::this_thread::sleep_for(50ms);  // cars arrive one after another
    }

    for (auto& car : cars)
        car.join();

    std::cout << "All cars are done\n";
    return 0;
}
