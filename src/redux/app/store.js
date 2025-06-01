import {configureStore} from '@reduxjs/toolkit';

import urlslice from '../slices/urlslice';

const store = configureStore({
    reducer: {
        allCart: urlslice,
    },
});
export default store;