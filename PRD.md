Develop a **Proof of Concept (POC)** for the learner-facing part of the **Freedom Training** platform using **Next.js**. All dynamic data (user information, courses, TUTE points, etc.) for this POC will be loaded from and managed via **local JSON configuration files** instead of a database.

**Platform Goal (for context):**
Freedom Training allows users to learn online, earn "TUTE" points, and contribute to social causes like the "Trường Sạch" (Clean School) program[cite: 7, 39].

**I. Core Learner Features (POC with Next.js & JSON):**

    **A. Simulated User Session & Profile:**
        1.  **User Data Loading:** On app start or a simulated login (e.g., selecting a user from a dropdown, or using a default user), load user-specific data from a corresponding JSON file (e.g., `user_data/[username].json`). This file should contain:
            * User ID/name.
            * **Selected School:** The ID or name of the school the user is associated with (critical for "Trường Sạch" contributions)[cite: 13].
            * Current TUTE point balance[cite: 13].
            * Course progress (e.g., list of completed course/lesson IDs).
        2.  **Profile Display:** A section to display the loaded user information, including their selected school and TUTE balance.

    **B. Course Discovery & Learning (from JSON):**
        1.  **Course Data:** Load course information from a master JSON file (e.g., `config/courses.json`). This file should list courses with attributes like:
            * ID, title, description.
            * Learning objectives.
            * Content (could be simple text, links to external videos for POC, or paths to local markdown files for lesson content).
            * Quiz information (e.g., a few sample questions and answers, also potentially in JSON).
            * TUTE points awarded upon completion[cite: 7].
            * Indication if a course is "paid" (though payment processing is out of scope for POC).
        2.  **Dashboard/Course Catalog:**
            * Display courses loaded from `courses.json`.
            * Allow users to "enroll" (this might just update an in-memory state for the POC).
        3.  **Learning Interface:**
            * Render course content (text, embedded links).
            * Simple quiz interface based on JSON data.
            * Track progress (completed lessons/quizzes) – update this in the in-memory user state.

    **C. Earning "TUTE" Points (Simulated):**
        1.  **TUTE Award Logic:** When a user completes a lesson or quiz (as tracked in the in-memory state):
            * Update their TUTE balance in the in-memory user state based on the points defined in `courses.json`.
        2.  **(Optional) Ad Viewing Simulation:**
            * A button like "Watch Ad for Bonus TUTE." Clicking it adds a predefined amount of TUTE to the in-memory user state.

    **D. "TUTE" Wallet & Management (In-Memory for POC):**
        1.  **Balance Display:** Dynamically display the TUTE balance from the in-memory user state.
        2.  **Transaction Log (Simulated):** Display a list of recent TUTE earning activities during the current session.
        3.  **School Contribution Display:** Clearly show what portion of *newly earned TUTE during the session* would notionally be contributed to their selected school. (Actual persistent contribution logic is out of POC scope).
        4.  **Redemption Simulation:**
            * Show a mock page of rewards/HappyMarket items (loaded from another JSON, e.g., `config/rewards.json`).
            * Allow "redeeming" TUTE, which deducts from the in-memory balance.

    **E. Gamification Placeholder:**
        * Include a placeholder page or section in the UI for the "Nuôi Voi" game, indicating it's a future feature[cite: 94].

    **F. Notifications (Session-based):**
        * Simple on-screen notifications for actions within the current session (e.g., "You earned X TUTE!", "Course Y completed!").

**II. Technical Requirements (Next.js & JSON):**

    1.  **Next.js Structure:** Use Next.js pages router or app router. Leverage Next.js features like `getStaticProps` or `getServerSideProps` (or Route Handlers in App Router) for initially loading data from JSON files into pages.
    2.  **Data Handling:**
        * All course data, user profiles (simulated), reward items, etc., should be defined in `.json` files within the project structure (e.g., in a `/data` or `/config` directory).
        * Focus on reading this data. For POC, updates to TUTE points or progress will primarily be managed in client-side React state (e.g., using `useState`, `useReducer`, or a simple state management library like Zustand or Jotai for client-side persistence during the session).
        * **No database connections.**
    3.  **State Management:** Implement client-side state management for the user's current session (TUTE balance, course progress within the session).
    4.  **Styling:** Use CSS Modules, Tailwind CSS, or a preferred modern CSS-in-JS solution compatible with Next.js.

**III. User Experience Goals for POC:**
* **Core Loop Demonstration:** Show the basic flow: user "logs in" (loads data), browses courses, "completes" a course/quiz, sees TUTE points increase, and sees potential school contribution.
* **Feasibility:** Demonstrate that the core learner interactions can be built with Next.js and managed with local data for rapid prototyping.
* **Intuitive Navigation:** Even as a POC, the navigation should be clear.

**Deliverables Expected from bolt.new:**
1.  A functional Next.js application structure.
2.  Example JSON file structures for users, courses, and rewards.
3.  Next.js pages/components implementing the learner features described above, reading from the JSON files.
4.  Client-side logic for managing TUTE points and course progress in-memory for the duration of a user session.
5.  Basic styling to ensure usability.