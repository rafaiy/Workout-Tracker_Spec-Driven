import { describe,it,expect } from 'vitest';
import request from 'supertest';
import app from './index';

describe('GymFlow API',()=>{
 it('reports health',async()=>{const r=await request(app).get('/api/v1/health');expect(r.status).toBe(200);expect(r.body.ok).toBe(true)});
 it('lists predefined exercises',async()=>{const r=await request(app).get('/api/v1/exercises');expect(r.status).toBe(200);expect(r.body.items.length).toBeGreaterThan(0)});
 it('starts and completes a workout once',async()=>{const start=await request(app).post('/api/v1/plans/plan-strength/workouts/start');expect(start.status).toBe(201);const id=start.body.id;const complete=await request(app).post(`/api/v1/workouts/${id}/complete`).send({durationSeconds:1800});expect(complete.status).toBe(200);expect(complete.body.status).toBe('completed');const again=await request(app).post(`/api/v1/workouts/${id}/complete`);expect(again.status).toBe(200);expect(again.body.status).toBe('completed')});
});
