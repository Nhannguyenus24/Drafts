#include <iostream>
using namespace std;

struct Node {
    int key;
    Node* next;
};

struct List {
    Node* pHead;
    Node* pTail;
};

List createList() {
    List pList;
    pList.pHead = nullptr;
    pList.pTail = nullptr;

    return pList;
}

bool addHead(List& L, int data) {
    Node* p_new_node = new Node;
    if (!p_new_node) {
        return false;
    }
    p_new_node->key = data;
    p_new_node->next = L.pHead;
    L.pHead = p_new_node;
    if (!L.pTail) {
        L.pTail = p_new_node;
    }
    return true;
}

bool addTail(List& L, int data) {
    Node* p_new_node = new Node;
    if (!p_new_node) {
        return false;
    }
    p_new_node->key = data;
    p_new_node->next = nullptr;
    if (!L.pHead) {
        L.pHead = p_new_node;
        L.pTail = p_new_node;
    }
    else {
        L.pTail->next = p_new_node;
        L.pTail = p_new_node;
    }
    return true;
}

void removeHead(List& L)
{
    if (L.pHead == NULL) return;
    Node* nextNode = L.pHead->next;
    delete L.pHead;
    if (nextNode == NULL)
    {    
        L.pHead = NULL;
        L.pTail = NULL;
        return;
    }
    L.pHead = nextNode;
}

void removeTail(List& L)
{
    if (L.pHead == NULL) return;
    if (L.pHead->next == NULL )
    {
        removeHead(L);
        return;
    }
    Node* cur = L.pHead;
    while (cur->next != L.pTail)
    {
        cur = cur->next;
    }
    delete L.pTail;
    L.pTail = cur;
    L.pTail->next = NULL;
}

void printList(List L) {
    Node* p_current_node = L.pHead;
    while (p_current_node != nullptr) {
        cout << p_current_node->key << "->";
        p_current_node = p_current_node->next;
    }
    cout << "NULL" << endl;
}

void removeAll(List& L) {
    Node* p_current_node = L.pHead;
    while (p_current_node) {
        Node* p_temp_node = p_current_node;
        p_current_node = p_current_node->next;
        delete p_temp_node;
    }
    L.pHead = nullptr;
    L.pTail = nullptr;
}

void removeBefore(List& L, int val) {
    if (L.pHead == nullptr || L.pHead->next == NULL) {
        return; // list is empty, nothing to remove
    }
    if (L.pHead->key == val) {
        return; // first node is the one we want to remove before, can't do it
    }
    if (L.pHead->next->key == val)
    {
        removeHead(L);
        return;
    }
    Node* p_current_node = L.pHead;
    while (p_current_node->next->next != nullptr && p_current_node->next->next->key != val) {
        p_current_node = p_current_node->next;
    }

    if (p_current_node->next->next != nullptr && p_current_node->next->next->key == val) {
        Node* tmp = p_current_node->next;
        p_current_node->next = tmp->next;
        delete tmp;
    }
}

void removeAfter(List& L, int val) {
    if (L.pHead == nullptr || L.pHead->next == NULL) {
        return; // list is empty, nothing to remove
    }
    Node* p_current_node = L.pHead;
    while (p_current_node != nullptr && p_current_node->key != val) {
        p_current_node = p_current_node->next;
    }
    if (p_current_node == nullptr || p_current_node == L.pTail ) return;
    if (p_current_node->next == L.pTail)
    {
        removeTail(L);
        return;
    }
    if (p_current_node->key == val) {
        Node* tmp = p_current_node->next;
        p_current_node->next = tmp->next;
        delete tmp;
    }
}

bool addPos(List& L, int data, int pos) {
    if (pos < 0) {
        // invalid position
        return false;
    }
    Node* newNode = new Node{ data, nullptr };
    if (pos == 0) {
        addHead(L, data);
    }
    else {
        // add after a specific position
        Node* prevNode = L.pHead;
        for (int i = 0; i < pos - 1 && prevNode != nullptr; i++) {
            prevNode = prevNode->next;
        }
        if (prevNode == nullptr) {
            // invalid position
            delete newNode;
            return false;
        }
        newNode->next = prevNode->next;
        prevNode->next = newNode;
        if (prevNode == L.pTail) {
            // added to the end of the list
            L.pTail = newNode;
        }
    }
    return true;
}

void removePos(List& L, int pos) {
    if (pos < 0) {
        // invalid position
        return;
    }
    if (L.pHead == nullptr) {
        // empty list
        return;
    }
    if (pos == 0) {
        removeHead(L);
    }
    else {
        // remove a node after a specific position
        Node* prevNode = L.pHead;
        for (int i = 0; i < pos - 1 && prevNode != nullptr; i++) {
            prevNode = prevNode->next;
        }
        if (prevNode == nullptr || prevNode->next == nullptr) {
            // invalid position
            return;
        }
        Node* oldNode = prevNode->next;
        prevNode->next = oldNode->next;
        delete oldNode;
        if (prevNode->next == nullptr) {
            // the last node was removed
            L.pTail = prevNode;
        }
    }
}

bool addBefore(List& L, int data, int val) {
    Node* newNode = new Node{ data, nullptr };
    if (L.pHead == nullptr) {
        // empty list
        L.pHead = L.pTail = newNode;
        return true;
    }
    if (L.pHead->key == val) {
        addHead(L, data);
    }
    Node* prevNode = nullptr;
    Node* currNode = L.pHead;
    while (currNode != nullptr && currNode->key != val) {
        prevNode = currNode;
        currNode = currNode->next;
    }
    if (currNode == nullptr) {
        // value not found in list
        delete newNode;
        return false;   
        cout << 0;
    }
    newNode->next = currNode;
    prevNode->next = newNode;
    return true;
}

bool addAfter(List& L, int data, int val) {
    Node* newNode = new Node{ data, nullptr };
    if (L.pHead == nullptr) {
        // empty list
        L.pHead = L.pTail = newNode;
        return true;
    }
    Node* node = L.pHead;
    while (node != nullptr && node->key != val) {
        node = node->next;
    }
    if (node == nullptr) {
        // value not found in list
        delete newNode;
        return false;
    }
    if (node == L.pTail) {
        // add to the end of the list
        node->next = newNode;
        L.pTail = newNode;
    }
    else {
        newNode->next = node->next;
        node->next = newNode;
    }
    return true;
}
int countElements(List L) {
    Node* curr = L.pHead;
    int count = 0;
    while (curr != NULL) {
        count++;
        curr = curr->next;
    }
    return count;
}
int countAppearance(List L, int value) {
    Node* curr = L.pHead;
    int count = 0;
    while (curr != NULL) {
        if (curr->key == value) {
            count++;
        }
        curr = curr->next;
    }
    return count;
}

bool removeElement(List& L, int key) {
    Node* curr = L.pHead;
    Node* prev = NULL;
    while (curr != NULL) {
        if (curr->key == key) {
            if (prev == NULL) {
                L.pHead = curr->next;
            }
            else {
                prev->next = curr->next;
            }
            if (curr == L.pTail) {
                L.pTail = prev;
            }
            delete curr;
            return true;
        }
        prev = curr;
        curr = curr->next;
    }
    return false;
}

List reverseList(List L) {
    List newL;
    newL.pHead = NULL;
    newL.pTail = NULL;
    Node* curr = L.pHead;
    while (curr != NULL) {
        Node* newNode = new Node();
        newNode->key = curr->key;
        newNode->next = newL.pHead;
        newL.pHead = newNode;
        if (newL.pTail == NULL) {
            newL.pTail = newNode;
        }
        curr = curr->next;
    }
    return newL;
}
void reverseKGroup(List& L, int k) {
    Node* prevGroupTail = NULL;
    Node* currGroupHead = L.pHead;
    while (currGroupHead != NULL) {
        // Kiểm tra xem có đủ k nút liền kề để đảo ngược không
        Node* curr = currGroupHead;
        int count = 0;
        while (curr != NULL && count < k) {
            curr = curr->next;
            count++;
        }
        if (count < k) { // Không đủ k nút liền kề để đảo ngược
            break;
        }

        // Đảo ngược từng cặp k nút liền kề
        Node* prev = NULL;
        curr = currGroupHead;
        Node* next = NULL;
        int i = 0;
        while (curr != NULL && i < k) {
            next = curr->next;
            curr->next = prev;
            prev = curr;
            curr = next;
            i++;
        }

        // Cập nhật con trỏ pHead và pTail của danh sách liên kết
        if (prevGroupTail == NULL) {
            L.pHead = prev;
        }
        else {
            prevGroupTail->next = prev;
        }
        currGroupHead->next = curr;
        prevGroupTail = currGroupHead;
        currGroupHead = curr;
    }
    if (L.pHead == NULL) {
        L.pTail = NULL;
    }
}

void findLongestIncDecSequence(List L) {
    int maxLen = 0;
    Node* startNode = NULL;
    Node* curr = L.pHead;
    while (curr != NULL) {
        // Tìm độ dài của chuỗi con tăng liên tục
        int incLen = 1;
        Node* incCurr = curr;
        while (incCurr != NULL && incCurr->next != NULL && incCurr->key < incCurr->next->key) {
            incLen++;
            incCurr = incCurr->next;
        }

        // Tìm độ dài của chuỗi con giảm liên tục
        int decLen = 0;
        Node* decCurr = incCurr;
        while (decCurr != NULL && decCurr->next != NULL && decCurr->key > decCurr->next->key) {
            decLen++;
            decCurr = decCurr->next;
        }

        // Tìm tổng độ dài của chuỗi tăng và chuỗi giảm có điểm kết thúc chung
        int len = incLen + decLen;
        if (len > maxLen) {
            maxLen = len;
            startNode = curr;
        }

        // Duyệt đến nút tiếp theo trong danh sách liên kết
        if (decLen > 0) {
            curr = decCurr; // Nếu có chuỗi giảm, chuyển sang nút kế tiếp để tiếp tục tìm kiếm chuỗi con tăng rồi giảm liên tục
        }
        else {
            curr = curr->next;
        }
    }

    // In ra chuỗi con tăng rồi giảm liên tục dài nhất
    cout << "Longest increasing then decreasing subsequence: ";
    Node* endNode = startNode;
    for (int i = 0; i < maxLen; i++) {
        cout << startNode->key << " ";
        if (i < maxLen - 1) {
            startNode = startNode->next;
        }
    }
}
int findLongestIncreasingSubsequence(List L) {
    if (L.pHead == NULL) {
        return 0;
    }
    int maxLength = 1;
    int length = 1;
    Node* p = L.pHead->next;
    Node* prev = L.pHead;
    while (p != NULL) {
        if (p->key > prev->key) {
            length++;
        }
        else {
            maxLength = max(maxLength, length);
            length = 1;
        }
        prev = p;
        p = p->next;
    }
    maxLength = max(maxLength, length);
    return maxLength;
}
List mergeSortedLists(List L1, List L2) {
    List result;
    result.pHead = NULL;
    result.pTail = NULL;

    Node* p1 = L1.pHead;
    Node* p2 = L2.pHead;

    while (p1 != NULL && p2 != NULL) {
        if (p1->key < p2->key) {
            addTail(result, p1->key);
            p1 = p1->next;
        }
        else {
            addTail(result, p2->key);
            p2 = p2->next;
        }
    }

    while (p1 != NULL) {
        addTail(result, p1->key);
        p1 = p1->next;
    }

    while (p2 != NULL) {
        addTail(result, p2->key);
        p2 = p2->next;
    }

    return result;
}
void splitList(List L, List& L1, List& L2) {
    if (L.pHead == NULL || L.pHead->next == NULL) {
        L1 = L;
        L2.pHead = NULL;
        L2.pTail = NULL;
        return;
    }
    Node* slow = L.pHead;
    Node* fast = L.pHead->next;
    while (fast != NULL) {
        fast = fast->next;
        if (fast != NULL) {
            slow = slow->next;
            fast = fast->next;
        }
    }
    L1.pHead = L.pHead;
    L1.pTail = slow;
    L2.pHead = slow->next;
    L2.pTail = L.pTail;
    slow->next = NULL;
}

int main() {
    List L = createList();
    for (int i = 0; i < 9; i++) {
        addHead(L, i);
    }
    for (int i = 9; i > 0; i--) {
        addHead(L, i);
    }
    printList(L);
    findLongestIncDecSequence(L);
    //printList(L);
    removeAll(L);
    return 0;
}