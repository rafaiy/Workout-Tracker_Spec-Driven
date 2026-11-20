import express from 'express';
import cors from 'cors';
import { z } from 'zod';

const app = express();
app.use(cors());
app.use(express.json());

const userId = 'demo-user';
const MUSCLE_GROUPS = ['Chest','Back','Shoulders','Biceps','Triceps','Forearms','Legs','Quadriceps','Hamstrings','Glutes','Calves','Abs','Core'];
const EQUIPMENT = ['Barbell','Dumbbell','Kettlebell','Machine','Cable','Bodyweight','Resistance Band','Other'];
const DIFFICULTIES = ['Beginner','Intermediate','Advanced'];

const exercises: any[] = [
  { id:'ex-bench', name:'Barbell Bench Press', primaryMuscleGroup:'Chest', secondaryMuscleGroups:['Shoulders','Triceps'], equipment:'Barbell', difficulty:'Intermediate', instructions:'Lower the bar with control and press upward.', iconReference:null, suggestedSets:4, suggestedReps:8, source:'predefined', ownerUserId:null },
  { id:'ex-squat', name:'Back Squat', primaryMuscleGroup:'Legs', secondaryMuscleGroups:['Glutes','Quadriceps'], equipment:'Barbell', difficulty:'Intermediate', instructions:'Brace, descend with control, and stand tall.', iconReference:null, suggestedSets:4, suggestedReps:6, source:'predefined', ownerUserId:null },
  { id:'ex-row', name:'Seated Cable Row', primaryMuscleGroup:'Back', secondaryMuscleGroups:['Biceps','Shoulders'], equipment:'Cable', difficulty:'Beginner', instructions:'Pull toward the torso while keeping your posture stable.', iconReference:null, suggestedSets:3, suggestedReps:10, source:'predefined', ownerUserId:null },
  { id:'ex-plank', name:'Forearm Plank', primaryMuscleGroup:'Core', secondaryMuscleGroups:['Shoulders','Abs'], equipment:'Bodyweight', difficulty:'Beginner', instructions:'Maintain a straight line from head to heels.', iconReference:null, suggestedSets:3, suggestedReps:30, source:'predefined', ownerUserId:null }
];

let plans: any[] = [{
  id:'plan-strength', userId, name:'Push Pull Legs', sessions:[
    { id:'session-push', name:'Push', exercises:[{ exerciseId:'ex-bench', name:'Barbell Bench Press', sets:4, reps:8 }] },
    { id:'session-pull', name:'Pull', exercises:[{ exerciseId:'ex-row', name:'Seated Cable Row', sets:3, reps:10 }] },
    { id:'session-legs', name:'Legs', exercises:[{ exerciseId:'ex-squat', name:'Back Squat', sets:4, reps:6 }] }
  ], lastCompletedSessionId:null, nextSessionId:'session-push'
}];

let workouts: any[] = [];

const exerciseSchema = z.object({
  name:z.string().trim().min(1), primaryMuscleGroup:z.enum(MUSCLE_GROUPS as [string,...string[]]),
  secondaryMuscleGroups:z.array(z.enum(MUSCLE_GROUPS as [string,...string[]])).default([]),
  equipment:z.enum(EQUIPMENT as [string,...string[]]), difficulty:z.enum(DIFFICULTIES as [string,...string[]]),
  instructions:z.string().trim().min(1), iconReference:z.string().nullable().optional(), suggestedSets:z.number().int().positive(), suggestedReps:z.number().int().positive()
});

const auth = (req:any, _res:any, next:any) => { req.userId = req.header('x-user-id') || userId; next(); };
const error = (res:any, code:string, message:string, status=400, details:any[]=[]) => res.status(status).json({ error:{ code,message,details } });

app.use('/api/v1', auth);

app.get('/api/v1/exercises', (req:any,res:any) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const muscle = String(req.query.muscle || '').split(',').filter(Boolean);
  const equipment = String(req.query.equipment || '').split(',').filter(Boolean);
  const difficulty = String(req.query.difficulty || '').split(',').filter(Boolean);
  const favorites = String(req.query.favorites || '') === 'true';
  const accessible = exercises.filter(e => e.source === 'predefined' || e.ownerUserId === req.userId);
  const filtered = accessible.filter(e => (!search || e.name.toLowerCase().includes(search))
    && (!muscle.length || muscle.includes(e.primaryMuscleGroup))
    && (!equipment.length || equipment.includes(e.equipment))
    && (!difficulty.length || difficulty.includes(e.difficulty)));
  res.json({ items:filtered, page:1, pageSize:filtered.length, total:filtered.length });
});

app.post('/api/v1/exercises', (req:any,res:any) => {
  const parsed = exerciseSchema.safeParse(req.body);
  if (!parsed.success) return error(res,'VALIDATION_ERROR','Invalid exercise fields',400,parsed.error.issues.map(i=>({field:String(i.path[0]),message:i.message})));
  const created = { id:`ex-${Date.now()}`, ...parsed.data, source:'custom', ownerUserId:req.userId };
  exercises.push(created);
  res.status(201).json(created);
});

app.get('/api/v1/plans', (req:any,res:any) => res.json(plans.filter(p=>p.userId===req.userId)));
app.post('/api/v1/plans', (req:any,res:any) => {
  const schema=z.object({name:z.string().trim().min(1),sessions:z.array(z.object({name:z.string().trim().min(1),exercises:z.array(z.any()).default([])})).default([])});
  const parsed=schema.safeParse(req.body); if(!parsed.success) return error(res,'VALIDATION_ERROR','Invalid plan',400);
  const plan:any={id:`plan-${Date.now()}`,userId:req.userId,name:parsed.data.name,lastCompletedSessionId:null,nextSessionId:null,sessions:parsed.data.sessions.map((s:any,i:number)=>({id:`session-${Date.now()}-${i}`,name:s.name,exercises:s.exercises}))};
  if(plan.sessions.length) plan.nextSessionId=plan.sessions[0].id;
  plans.push(plan); res.status(201).json(plan);
});

app.get('/api/v1/plans/:planId/next-session',(req:any,res:any)=>{ const p=plans.find(x=>x.id===req.params.planId&&x.userId===req.userId); if(!p)return error(res,'NOT_FOUND','Plan not found',404); const s=p.sessions.find((x:any)=>x.id===p.nextSessionId); res.json(s||null); });

app.post('/api/v1/plans/:planId/workouts/start',(req:any,res:any)=>{
  const p=plans.find(x=>x.id===req.params.planId&&x.userId===req.userId); if(!p)return error(res,'NOT_FOUND','Plan not found',404); const s=p.sessions.find((x:any)=>x.id===p.nextSessionId); if(!s)return error(res,'NO_NEXT_SESSION','Plan has no valid session',409);
  const snapshot={planName:p.name,session:s}; const workout={id:`workout-${Date.now()}`,userId:req.userId,planId:p.id,status:'in_progress',startedAt:new Date().toISOString(),finishedAt:null,snapshot,durationSeconds:0,sets:[]}; workouts.push(workout); res.status(201).json(workout);
});

app.post('/api/v1/workouts/:workoutId/save-incomplete',(req:any,res:any)=>{ const w=workouts.find(x=>x.id===req.params.workoutId&&x.userId===req.userId); if(!w)return error(res,'NOT_FOUND','Workout not found',404); Object.assign(w,req.body,{status:'in_progress',updatedAt:new Date().toISOString()}); res.json(w); });
app.post('/api/v1/workouts/:workoutId/discard',(req:any,res:any)=>{ const w=workouts.find(x=>x.id===req.params.workoutId&&x.userId===req.userId); if(!w)return error(res,'NOT_FOUND','Workout not found',404); w.status='discarded'; w.finishedAt=new Date().toISOString(); res.json(w); });
app.post('/api/v1/workouts/:workoutId/complete',(req:any,res:any)=>{
  const w=workouts.find(x=>x.id===req.params.workoutId&&x.userId===req.userId); if(!w)return error(res,'NOT_FOUND','Workout not found',404); if(w.status==='completed')return res.json(w);
  const p=plans.find(x=>x.id===w.planId&&x.userId===req.userId); if(p){ const index=p.sessions.findIndex((s:any)=>s.id===w.snapshot.session.id); p.lastCompletedSessionId=w.snapshot.session.id; p.nextSessionId=p.sessions.length ? p.sessions[(index+1)%p.sessions.length].id : null; }
  w.status='completed'; w.finishedAt=new Date().toISOString(); w.durationSeconds=Number(req.body.durationSeconds||w.durationSeconds||0); res.json(w);
});

app.get('/api/v1/history',(req:any,res:any)=>res.json(workouts.filter(w=>w.userId===req.userId)));
app.get('/api/v1/history/calendar',(req:any,res:any)=>res.json(workouts.filter(w=>w.userId===req.userId).reduce((map:any,w:any)=>{const day=(w.startedAt||'').slice(0,10);(map[day]??=[]).push(w);return map;},{})));
app.get('/api/v1/history/:workoutId',(req:any,res:any)=>{const w=workouts.find(x=>x.id===req.params.workoutId&&x.userId===req.userId); if(!w)return error(res,'NOT_FOUND','Workout not found',404);res.json(w);});

app.get('/api/v1/progress/summary',(req:any,res:any)=>{const completed=workouts.filter(w=>w.userId===req.userId&&w.status==='completed');res.json({workoutCount:completed.length,completedSets:completed.reduce((n,w)=>n+(w.sets?.length||0),0),volume:0,activity:[]});});

app.get('/api/v1/health',(_req:any,res:any)=>res.json({ok:true}));

const port=Number(process.env.PORT||4000);
if (process.env.NODE_ENV !== 'test') app.listen(port,()=>console.log(`GymFlow API listening on ${port}`));
export default app;
