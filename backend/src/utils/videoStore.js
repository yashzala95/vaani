// ==============================================
// Video Store Utility
// Agar MongoDB connected hai to Mongoose model use karo,
// warna in-memory Map me data rakho (dev/testing ke liye)
// Isse app bina database ke bhi fully kaam karta hai
// ==============================================

const mongoose = require("mongoose");
const Video = require("../models/Video");

// In-memory fallback storage
const memoryStore = new Map();

const isDBConnected = () => mongoose.connection.readyState === 1;

/**
 * Naya video record create karo
 */
const createVideo = async (data) => {
  if (isDBConnected()) {
    const video = await Video.create(data);
    return video.toObject();
  }
  const id = data._id || require("uuid").v4();
  const record = { ...data, _id: id, createdAt: new Date() };
  memoryStore.set(id, record);
  return record;
};

/**
 * ID se video record fetch karo
 */
const getVideoById = async (id) => {
  if (isDBConnected()) {
    const video = await Video.findById(id);
    return video ? video.toObject() : null;
  }
  return memoryStore.get(id) || null;
};

/**
 * Video record update karo
 */
const updateVideo = async (id, updates) => {
  if (isDBConnected()) {
    const video = await Video.findByIdAndUpdate(id, updates, { new: true });
    return video ? video.toObject() : null;
  }
  const existing = memoryStore.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  memoryStore.set(id, updated);
  return updated;
};

module.exports = { createVideo, getVideoById, updateVideo, isDBConnected };
