import { configureStore } from '@reduxjs/toolkit';

import urlslice from '../slices/urlslice';
import authReducer from '../slices/authSlice';
import departmentsReducer from '../slices/departmentsSlice';
import packagesReducer from '../slices/packagesSlice';
import subscriptionsReducer from '../slices/subscriptionsSlice';
import usersReducer from '../slices/usersSlice';

const store = configureStore({
    reducer: {
        allCart: urlslice,
        auth: authReducer,
        departments: departmentsReducer,
        packages: packagesReducer,
        subscriptions: subscriptionsReducer,
        users: usersReducer,
    },
});
export default store;