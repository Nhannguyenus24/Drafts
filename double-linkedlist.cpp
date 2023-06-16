#include <iostream>
using namespace std;

struct Node{
    int data;
    Node* next;
    Node*prev;
};
struct List{
    Node* head;
    Node* tail;
};

Node* createNode(int val){
    Node* newN = new Node;
    newN->data = val;
    newN->next = nullptr;
    newN->prev = nullptr;
    return newN;
}

List createL(Node* node){
    List l;
    l.head = node;
    l.tail = node;
    return l;
}

void addHead(List& l, int val){
    Node* newN = createNode(val);
    newN->next = l.head;
    l.head->prev = newN;
    l.head = newN;
}

void addTail(List& l, int val){
    Node* newN = createNode(val);
    newN->prev = l.tail;
    l.tail->next = newN;
    l.tail = newN;
}

void removePos(int pos, List& l){ //begin at 0
    if (pos < 0)
        return;
    if ( l.head == nullptr)
        return;
    Node* current = l.head;
    if (pos == 0){
        l.head = current->next;
        l.head->prev = nullptr;
        delete current;
        return;
    }
    current = current->next;
    int index = 1;
    while( current != nullptr && index != pos){
        index++;
        current = current->next;
    }
    if (current == nullptr)
        return;
    if (current->next == nullptr){
        current->prev->next = nullptr;
        l.tail = current->prev;
    }
    else{
        current->prev->next = current->next;
        current->next->prev = current->prev;
    }
    delete current;
}

void addPos(int pos, int val, List& l){ // begin at 0
    Node* newN = createNode(val);
    if (pos == 0){
        newN->prev = nullptr;
        newN->next = l.head;
        l.head->prev = newN;
        l.head = newN;
        return;
    }
    if (pos < 0)
        return;
    Node* current = l.head;
    int index = 1;
    while(current != nullptr && index != pos){
        current = current->next;
        index++;
    }
    if (current == nullptr)
        return;
    if (current->next == nullptr){
        newN->next = nullptr;
        newN->prev = l.tail;
        l.tail->next = newN;
        l.tail = newN;
    }
    else{
        current->next->prev = newN;
        newN->next = current->next;
        newN->prev = current;
        current->next = newN;
    }
}

void removeDuplicate(List& l){
    if (l.head == nullptr)
        return;
    Node* current = l.head;
    while (current->next != nullptr){
        Node* check = current->next;
        while (check != nullptr){
            if (check->data != current->data)
                check = check->next;
            else{
                if (check == l.tail){
                    l.tail = l.tail->prev;
                    l.tail->next = nullptr;
                    Node* temp = check;
                    check = check->next;
                    delete temp;
                    break;
                }
                else{
                    Node* temp = check;
                    check->prev->next = check->next;
                    check->next->prev = check->prev;
                    check = check->next;
                    delete temp;
                }
            }
        }
        current = current->next; 
    }
}

int countElement(List& l){
    int count = 0;
    Node* current = l.head;
    while(current != nullptr){
        count++;
        current = current->next;
    }
    return count;
}

bool ascending(int a, int b) {
    return a < b;
}

bool descending(int a, int b) {
    return a > b;
}

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void sortList(List& l, bool (*compare)(int, int)) {
    if (l.head == nullptr || l.head->next == nullptr) {
        return;
    }
    Node* current = l.head;
    while (current != nullptr) {
        Node* minNode = current;
        Node* innerCurr = current->next;
        while (innerCurr != nullptr) {
            if (compare(innerCurr->data, minNode->data)) {
                minNode = innerCurr;
            }
            innerCurr = innerCurr->next;
        }
        if (minNode != current) {
            swap(&(current->data), &(minNode->data));
        }
        current = current->next;
    }
}

void printL(List L){
    Node* current = L.head;
    while(current != nullptr){
        cout<<current->data<<" -> ";
        current = current->next;
    }
    cout<<"nullptr"<<endl;
}

void printLL(List L){     // print reverse list
    Node* current = L.tail;
    cout<<"nullptr";
    while(current != nullptr){
        cout<<" <- "<<current->data;
        current = current->prev;
    }
    cout<<endl;
}

void removeAll(List& l){
    Node* current = l.head;
    if (current == nullptr)
        return;
    while (current != nullptr){
        Node* tmp = current;
        current = current->next;
        delete tmp;
    }
    l.head = nullptr;
    l.tail = nullptr;
}
int main(){
    List l = createL(createNode(0));
    for (int i = 1; i < 10; i++)
        addTail(l,i);
    addTail(l,3);
    addPos(0,2,l);
    printL(l);
    sortList(l,ascending);
    printL(l);
    removeAll(l);
    return 0;
}