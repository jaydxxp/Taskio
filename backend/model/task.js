const mongoose = require('mongoose');
const { Schema } = mongoose;

const ActivitySchema = new Schema({
  actor: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  action: { type: String, required: true }, 
  payload: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const SubtaskSchema = new Schema({
  id: { type: String },
  title: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, default: 'todo' },
  priority: { type: String, default: 'Medium' },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  assignee: { type: Schema.Types.ObjectId, ref: 'User', required: false },
  dueDate: { type: Date },
  subtasks: { type: [SubtaskSchema], default: [] },
  files: { type: Array, default: [] },
  comments: { type: Number, default: 0 },
  activities: { type: [ActivitySchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TaskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.models.Task || mongoose.model('Task', TaskSchema);
