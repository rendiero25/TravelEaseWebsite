import {BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index.jsx";
import SearchResults from "./pages/SearchResults.jsx";

const App = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/search-results" element={<SearchResults />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;