#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>

// Every thread function must return void* and accept void*
void* thread_runner(void* arg) {
    int* thread_num = (int*)arg; // Cast void pointer back to original type
    printf("Hello from Worker Thread #%d!\n", *thread_num);

    // Dynamically allocate a return value to safely pass back
    int* result = malloc(sizeof(int));
    *result = (*thread_num) * 10;

    pthread_exit((void*)result); // Equivalent to returning result;
}

int main() {
    pthread_t worker_thread;
    int thread_arg = 1;
    void* thread_return_val;

    // 1. Create the thread (ID, Attributes, Function, Argument)
    if (pthread_create(&worker_thread, NULL, thread_runner, &thread_arg) != 0) {
        perror("Failed to create thread");
        return 1;
    }

    printf("Hello from the Main Thread!\n");

    // 2. Join the thread (Wait for it to finish and catch its return value)
    if (pthread_join(worker_thread, &thread_return_val) != 0) {
        perror("Failed to join thread");
        return 1;
    }

    // 3. Process the returned data
    int* output = (int*)thread_return_val;
    printf("Worker thread returned: %d\n", *output);

    free(output); // Clean up dynamically allocated memory
    return 0;
}
