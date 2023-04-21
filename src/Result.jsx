import { useContext } from "react";
import { Typography } from "@mui/material";

import { CollectionContext } from './firebase/Collection';

function Result() {
    const { questions } = useContext(CollectionContext);
    console.log(questions);

    return <Typography variant="h1" my={2} fontSize={36} fontWeight="600">Current Result</Typography>;
}

export default Result;
