import { useMediaQuery } from "@mui/material";

const useIsMobile = () => useMediaQuery('(max-width:600px)');

export default useIsMobile;
