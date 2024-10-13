import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface initialStateTypes {  // definimos os tipos dos states iniciais
    isSidebarCollapsed: boolean;
    isDarkMode: boolean;
}


const initialState: initialStateTypes = {   // definimos os states iniciais
    isSidebarCollapsed: false,
    isDarkMode: false,
};

export const globalSlice = createSlice({    // criamos o slice global
    name: 'global',
    initialState,                           // passamos os estados iniciais do isSidebarCollapsed e do isDarkMode
    reducers: {
        setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isSidebarCollapsed = action.payload;
        },                                  // criamos o reducer setIsSidebarCollapsed, que pegará o state e a action, e setará o isSidebarCollapsed para o valor da action
                                            // o payload da action que passamos é um booleano, que é o valor que queremos setar para o isSidebarCollapsed
                                            // quando chamamos setIsSidebarCollapsed(true), o payload da action será true, e o isSidebarCollapsed será setado para true pelo reducer
        setIsDarkMode: (state, action: PayloadAction<boolean>) => {
            state.isDarkMode = action.payload;
        },
    }
})

export const { setIsDarkMode, setIsSidebarCollapsed } = globalSlice.actions; // exportamos as funções para  fazer o dispatch da mudança de estado global

export default globalSlice.reducer;         // exportamos o reducer global