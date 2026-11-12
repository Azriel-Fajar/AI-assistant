// Program 1: Windows API thread
// The pthread example converted to native Win32 threads.
// Compile: gcc -std=c23 1_winapi_thread.c -o 1_winapi_thread

#include <windows.h>
#include <stdio.h>

// Every Win32 thread function must return DWORD and accept LPVOID (void*)
DWORD WINAPI thread_runner(LPVOID arg) {
    int* thread_num = (int*)arg; // Cast void pointer back to original type
    printf("Hello from Worker Thread #%d!\n", *thread_num);

    // The return value travels back as the thread's exit code (a DWORD),
    // so no malloc is needed
    DWORD result = (DWORD)(*thread_num) * 10;

    ExitThread(result); // Equivalent to return result;
}

int main(void) {
    HANDLE worker_thread;
    int thread_arg = 1;
    DWORD thread_return_val;

    // 1. Create the thread (Security, Stack size, Function, Argument, Flags, Thread ID)
    worker_thread = CreateThread(NULL, 0, thread_runner, &thread_arg, 0, NULL);
    if (worker_thread == NULL) {
        fprintf(stderr, "Failed to create thread (error %lu)\n", GetLastError());
        return 1;
    }

    printf("Hello from the Main Thread!\n");

    // 2. Join the thread (Wait until the thread handle is signaled = thread finished)
    if (WaitForSingleObject(worker_thread, INFINITE) != WAIT_OBJECT_0) {
        fprintf(stderr, "Failed to join thread (error %lu)\n", GetLastError());
        return 1;
    }

    // 3. Process the returned data (read the thread's exit code)
    if (!GetExitCodeThread(worker_thread, &thread_return_val)) {
        fprintf(stderr, "Failed to get exit code (error %lu)\n", GetLastError());
        return 1;
    }
    printf("Worker thread returned: %lu\n", thread_return_val);

    CloseHandle(worker_thread); // Clean up the thread handle
    return 0;
}
