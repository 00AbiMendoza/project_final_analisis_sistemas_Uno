import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/modules/auth/pages/LoginPage.vue';
import AppointmentAgendaPage from '@/modules/appointments/pages/AppointmentAgendaPage.vue';
import { authGuard } from '@/router/guards';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomePage,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage,
            meta: { guest: true },
        },
        {
            path: '/agenda-citas',
            name: 'appointments.agenda',
            component: AppointmentAgendaPage,
        },
    ],
});

router.beforeEach(authGuard);

export default router;