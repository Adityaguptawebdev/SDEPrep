# 20. Graph Algorithms (Topological Sort, Shortest Path)

> **Standard definition**: Algorithms operating on graphs (nodes + edges) to solve problems like ordering nodes respecting dependencies (topological sort) or finding minimum-cost paths (shortest path algorithms like Dijkstra/Bellman-Ford).

**Ek line mein**: Jab problem mein **"dependencies"** (X, Y se pehle hona
chahiye) ya **"shortest/cheapest path"** ka zikar ho, ye graph algorithms
yaad karo — BFS/DFS se aage ka level hai.

**Trick yaad rakhne ki**: *"College ke prerequisite courses"* — "Data
Structures" lene se pehle "Programming Basics" lena zaroori hai. Isi
dependency order ko nikalna **Topological Sort** hai. Aur "sabse sasta
raasta" dhoondhna (jaha edges ka apna "cost/weight" hai) **Dijkstra/Bellman-Ford** hai.

**Kab use karo**:
- **Topological Sort** — task scheduling, course prerequisites, build dependencies
- **Dijkstra** — shortest path, saare edge weights **positive** hain
- **Bellman-Ford** — shortest path, **negative weights bhi** ho sakte hain

## Code example — Course Schedule (Topological Sort via BFS)

```java
public boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> graph = new ArrayList<>();
    int[] inDegree = new int[numCourses];   // 🔑 har course ke "kitne prerequisites bache hain"

    for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
    for (int[] pre : prerequisites) {
        graph.get(pre[1]).add(pre[0]);   // pre[1] -> pre[0] (pre[1] pehle chahiye)
        inDegree[pre[0]]++;
    }

    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) queue.offer(i);   // jinke koi prerequisite nahi, unse shuru karo
    }

    int completed = 0;
    while (!queue.isEmpty()) {
        int course = queue.poll();
        completed++;

        for (int next : graph.get(course)) {
            inDegree[next]--;                    // ek prerequisite complete ho gaya
            if (inDegree[next] == 0) {
                queue.offer(next);                // 🔑 ab sab prerequisites poore ho gaye, ye bhi le lo
            }
        }
    }
    return completed == numCourses;   // agar sab complete nahi hue, matlab CYCLE hai
}
```

**Line by line samjho**: `inDegree[i]` batata hai course `i` ke **kitne
prerequisites bache hain**. Jinka `inDegree == 0` hai, unhe **turant** le
sakte hain (queue mein daal do). Jaise-jaise course complete hote hain,
unpe depend karne wale courses ka `inDegree` **ghatate** jao — jab kisi
ka `inDegree` 0 ho jaye, wo bhi ready hai. Agar end mein `completed !=
numCourses`, matlab kahi **cycle** hai (courses ek dusre pe circular depend
kar rahe the) — kabhi complete hi nahi ho sakte.

## Practice — kam se kam 6 LeetCode problems

| # | Problem | Type | Difficulty | Link |
|---|---|---|---|---|
| 1 | Course Schedule | Topological Sort | Medium | [leetcode.com/problems/course-schedule](https://leetcode.com/problems/course-schedule/) |
| 2 | Course Schedule II | Topological Sort | Medium | [leetcode.com/problems/course-schedule-ii](https://leetcode.com/problems/course-schedule-ii/) |
| 3 | Alien Dictionary 🔒 (Premium) | Topological Sort | Hard | [leetcode.com/problems/alien-dictionary](https://leetcode.com/problems/alien-dictionary/) |
| 4 | Network Delay Time | Dijkstra | Medium | [leetcode.com/problems/network-delay-time](https://leetcode.com/problems/network-delay-time/) |
| 5 | Cheapest Flights Within K Stops | Bellman-Ford | Medium | [leetcode.com/problems/cheapest-flights-within-k-stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) |
| 6 | Word Search | Matrix Traversal | Medium | [leetcode.com/problems/word-search](https://leetcode.com/problems/word-search/) |

---

## Sab 20 patterns ho gaye

Ye 20 patterns hi 90% LeetCode problems cover karte hain — jab bhi koi
naya problem dekho, sabse pehle poocho **"ye kaunse pattern jaisa lag raha
hai?"** (subarray → Sliding Window, sorted array pairs → Two Pointers,
dependencies → Graph, waghera). Pattern pehchan lo toh solution likhna
bahut aasan ho jata hai.

Practice order suggestion: Sliding Window → Two Pointers → Fast/Slow → Stack
→ Binary Search → BFS/DFS → Backtracking → DP — ye roughly easy se hard ka order hai.
