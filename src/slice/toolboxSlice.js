import { createSlice } from "@reduxjs/toolkit";
import { MENUITEMS,COLORS } from "@/constants";
const initialState={
    [MENUITEMS.PENCIL]:{
        color: COLORS.BLACK,
        size:4
    },
    [MENUITEMS.ERASER]:{
        color:COLORS.WHITE,
        size:4
    },
    [MENUITEMS.UNDO]:{},
    [MENUITEMS.REDO]:{},
    [MENUITEMS.DOWNLOAD]:{},
}

export const toolboxSlice = createSlice({
    name:'toolbox',
    initialState,
    reducers:{
        changeColor:(state,action)=>{
           state[action.payload.item].color=action.payload.color
        },
        changeBrushSize:(state,action)=>{
            state[action.payload.item].size=action.payload.size
         },
    }
})
export const {changeColor,changeBrushSize}=toolboxSlice.actions
export default toolboxSlice.reducer