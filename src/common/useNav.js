import { useCallback } from "react";
import { h0 } from "./fp";
export default function useNav(departDate, dispatch, prevDate, nextDate){

    const isPrevDisable = h0(departDate) <=  h0();
    const isNextDisable = h0(departDate) - h0() >  + 20 * 86400 * 1000;

    const prev = useCallback(() => {
        if(isPrevDisable){
            return;
        }
        dispatch(prevDate());
    }, [isPrevDisable]);

    const next = useCallback(() => {
        if(isNextDisable){
            return;
        }
        dispatch(nextDate());
    },[isNextDisable]);

    
    return {
        isPrevDisable,
        isNextDisable,
        prev,
        next
    }
} 