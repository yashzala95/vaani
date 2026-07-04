// ==============================================
// App Component
// Poore app ka routing structure yahan define hai
// ==============================================

import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import AmbientScene from "./components/common/AmbientScene";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import Export from "./pages/Export";

function App() {
  return (
    <div className="min-h-screen bg-cream dark:bg-dark-bg text-gray-900 dark:text-gray-100">
      <AmbientScene />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/export" element={<Export />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
