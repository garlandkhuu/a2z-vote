import { useContext } from "react";
import { Typography } from "@mui/material";

import { CollectionContext } from './firebase/Collection';
import ResultChart from "./components/ResultChart";

function Result() {
    const { questions } = useContext(CollectionContext);
    const activeQuestion = questions.find((question) => question.visible);

    return activeQuestion ? <ResultChart question={activeQuestion} /> : <Typography variant="p">Loading...</Typography>;
}

export default Result;
