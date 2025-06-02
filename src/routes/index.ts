import express from 'express';
import userRoutes from './users.routes';
import authRoutes from './auth.routes';
import blogRoutes from './blog.routes';


const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/blog', blogRoutes);
export default router;