#include <iostream>
#include <cmath>

struct Node {
    int key;
    Node* left;
    Node* right;
    int height;
};

Node* createNode(int data) {
    Node* newNode = new Node;
    newNode->key = data;
    newNode->left = NULL;
    newNode->right = NULL;
    newNode->height = 1; // New node is initially a leaf
    return newNode;
}

int getHeight(Node* node) {
    if (node == NULL)
        return 0;
    return node->height;
}

void updateHeight(Node* node) {
    if (node == NULL)
        return;
    node->height = 1 + std::max(getHeight(node->left), getHeight(node->right));
}

Node* rightRotate(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;

    x->right = y;
    y->left = T2;

    updateHeight(y);
    updateHeight(x);

    return x;
}

Node* leftRotate(Node* x) {
    Node* y = x->right;
    Node* T2 = y->left;

    y->left = x;
    x->right = T2;

    updateHeight(x);
    updateHeight(y);

    return y;
}

Node* balance(Node* node) {
    if (node == NULL)
        return NULL;

    int balanceFactor = getHeight(node->left) - getHeight(node->right);

    if (balanceFactor > 1) {
        if (getHeight(node->left->left) >= getHeight(node->left->right)) {
            return rightRotate(node);
        } else {
            node->left = leftRotate(node->left);
            return rightRotate(node);
        }
    }
    if (balanceFactor < -1) {
        if (getHeight(node->right->right) >= getHeight(node->right->left)) {
            return leftRotate(node);
        } else {
            node->right = rightRotate(node->right);
            return leftRotate(node);
        }
    }
    return node;
}

void Insert(Node* &pRoot, int x) {
    if (pRoot == NULL) {
        pRoot = createNode(x);
        return;
    }

    if (x < pRoot->key)
        Insert(pRoot->left, x);
    else if (x > pRoot->key)
        Insert(pRoot->right, x);
    else
        return;

    updateHeight(pRoot);
    pRoot = balance(pRoot);
}

Node* findMinNode(Node* node) {
    while (node->left != NULL)
        node = node->left;
    return node;
}

void Remove(Node* &pRoot, int x) {
    if (pRoot == NULL)
        return;

    if (x < pRoot->key)
        Remove(pRoot->left, x);
    else if (x > pRoot->key)
        Remove(pRoot->right, x);
    else {
        if (pRoot->left == NULL || pRoot->right == NULL) {
            Node* temp = pRoot->left ? pRoot->left : pRoot->right;

            if (temp == NULL) {
                temp = pRoot;
                pRoot = NULL;
            } else
                *pRoot = *temp;

            delete temp;
        } else {
            Node* temp = findMinNode(pRoot->right);
            pRoot->key = temp->key;
            Remove(pRoot->right, temp->key);
        }
    }

    if (pRoot == NULL)
        return;

    updateHeight(pRoot);
    pRoot = balance(pRoot);
}

bool isAVL(Node* pRoot) {
    if (pRoot == NULL)
        return true;

    int balanceFactor = abs(getHeight(pRoot->left) - getHeight(pRoot->right));

    if (balanceFactor > 1)
        return false;

    return isAVL(pRoot->left) && isAVL(pRoot->right);
}

int main() {
    Node* root = NULL;

    Insert(root, 10);
    Insert(root, 20);
    Insert(root, 30);
    Insert(root, 40);
    Insert(root, 50);

    std::cout << "AVL tree: " << (isAVL(root) ? "Yes" : "No") << std::endl;

    Remove(root, 30);

    std::cout << "AVL tree after removal: " << (isAVL(root) ? "Yes" : "No") << std::endl;

    return 0;
}
