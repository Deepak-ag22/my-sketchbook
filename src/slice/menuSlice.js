import { createSlice } from "@reduxjs/toolkit";
import { MENUITEMS } from "@/constants";
const initialState={
    activeMenuItem: MENUITEMS.PENCIL,
    actionMenuItem: null
}
export const menuSlice = createSlice({
    name:'menu',
    initialState,
    reducers:{
        menuItemclick:(state,action)=>{
            state.activeMenuItem=action.payload
        },
        actionItemclick:(state,action)=>{
            state.actionMenuItem=action.payload
        }
    }
})
export const {menuItemclick,actionItemclick}=menuSlice.actions
export default menuSlice.reducer