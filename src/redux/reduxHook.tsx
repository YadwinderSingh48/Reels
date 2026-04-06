import {useDispatch, useSelector,TypedUseSelectorHook} from 'react-redux';
import type {RootState, AppDispatch} from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
// export const useApSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppSelector = useSelector.withTypes<RootState>();