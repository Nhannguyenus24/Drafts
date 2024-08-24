#include <iostream>
#include <ctime>
using namespace std;

struct Node {
    int data;
    Node* next;
};

struct Priority_queue { // max heap
    Node* front = nullptr;
    Node* rear = nullptr;
};

void swap(int& a, int& b);
void print_queue(Priority_queue q);
int parent(int i);
int leftChild(int i);
int rightChild(int i);
Node* findNode(Priority_queue q, int i);
void shiftUp(Priority_queue& q, int i);
void shiftDown(Priority_queue& q, int i);
void enqueue(Priority_queue& q, int key);
bool is_empty(Priority_queue q);
int count_element(Priority_queue q);
void remove_all(Priority_queue& q);
void insert_element(Priority_queue& q, int key);
void remove_element(Priority_queue& q, int index);
Priority_queue create_queue(int* a, int n);

void swap(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}
void print_queue(Priority_queue q) {
    if (q.front == NULL)
        cout << "This queue is empty!" << endl;
    Node* cur = q.front;
    while (cur != NULL) {
        cout << cur->data << " ";
        cur = cur->next;
    }
    cout << endl;
}

int parent(int i) {
    return (i - 1) / 2;
}

int leftChild(int i) {

    return ((2 * i) + 1);
}

int rightChild(int i) {

    return ((2 * i) + 2);
}

Node* findNode(Priority_queue q, int i) {
    Node* currentNode = q.front;
    int index = 0;

    while (currentNode != NULL) {
        if (index == i) {
            return currentNode;
        }

        index++;
        currentNode = currentNode->next;
    }

    return NULL;
}
void shiftUp(Priority_queue& q, int i) {
    while (i > 0 && findNode(q, parent(i))->data < findNode(q, i)->data) {
        // Swap parent and current node
        swap(findNode(q, parent(i))->data, findNode(q, i)->data);

        // Update i to parent of i
        i = parent(i);
    }
}

// Function to shift down the node in
// order to maintain the heap property
void shiftDown(Priority_queue& q, int i) {
    int maxIndex = i;
    int size = count_element(q);
    // Left Child
    int l = leftChild(i);
    if (l <= size - 1 && findNode(q, l)->data > findNode(q, maxIndex)->data) {
        maxIndex = l;
    }

    // Right Child
    int r = rightChild(i);

    if (r <= size - 1 && findNode(q, r)->data > findNode(q, maxIndex)->data) {
        maxIndex = r;
    }
    // If i not same as maxIndex
    if (i != maxIndex) {
        swap(findNode(q, i)->data, findNode(q, maxIndex)->data);
        shiftDown(q, maxIndex);
    }
}
void enqueue(Priority_queue& q, int key) {
    Node* temp = new Node;
    temp->data = key;
    temp->next = NULL;
    if (q.rear == NULL) {
        q.front = q.rear = temp;
        return;
    }
    q.rear->next = temp;
    q.rear = temp;
}

bool is_empty(Priority_queue q) { // Test whether a priority queue is empty
    return q.front == NULL;
}

int count_element(Priority_queue q) { //Get the number of items in the priority queue
    int count = 0;
    Node* cur = q.front;
    while (cur != NULL) {
        count++;
        cur = cur->next;
    }
    return count;
}

void remove_all(Priority_queue& q) { // Remove all items from the priority queue
    if (q.front != NULL) {
        Node* cur = q.front;
        while (cur != NULL) {
            Node* temp = cur;
            cur = cur->next;
            delete temp;
        }
        q.front = NULL, q.rear = NULL;
    }
}


void insert_element(Priority_queue& q, int key) {  //Insert a new item into the priority queue
    enqueue(q, key);
    int size = count_element(q);
    // Shift Up to maintain heap property
    shiftUp(q, size - 1);
}

void remove_element(Priority_queue& q, int index) { // Remove an item from the priority queue
    int size = count_element(q);
    if (index >= size) // Change to ">=" to allow removal of the last element
        return;

    if (size == 1) { // If there's only one element, remove it and update front and rear pointers
        Node* temp = q.front;
        q.front = NULL;
        q.rear = NULL;
        delete temp;
        return;
    }

    // Swap the element to be removed with the last element
    swap(findNode(q, index)->data, findNode(q, size - 1)->data);

    // Update the size after swapping and remove the last element
    size -= 1;
    Node* temp = findNode(q, size - 1);
    Node* temp2 = temp->next;
    temp->next = NULL;
    q.rear = temp;
    delete temp2;
    if (index >= size)
        return;
    if (index > 0 && findNode(q, index)->data > findNode(q, parent(index))->data) {
        // Check if the swapped element should be shifted up
        shiftUp(q,index);
    }
    else {
        // Otherwise, shift it down
        shiftDown(q, index);
    }
}

Priority_queue create_queue(int* a, int n) {
    Priority_queue q;
    for (int i = 0; i < n; i++)
        insert_element(q, a[i]);
    return q;
}


int main() {
    Priority_queue q;
    srand(time(0));
    for (int i = 0; i < 10; i++) {
        int t = rand() % 50;
        cout << t << " ";
        insert_element(q, t);
    }
    cout << endl;
    print_queue(q);
    for (int i = 0; i < 10; i++)
    {
        remove_element(q, 1);
        print_queue(q);
    }
    return 0;
}