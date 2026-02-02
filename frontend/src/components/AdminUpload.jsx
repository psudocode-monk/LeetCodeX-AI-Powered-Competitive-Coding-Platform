import { useParams } from "react-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosClient from "../utils/axiosClient";

function AdminUpload() {
  const { problemId } = useParams();

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const selectedFile = watch("videoFile")?.[0];

  // Upload video to Cloudinary
  const onSubmit = async (data) => {
    const file = data.videoFile[0];

    setUploading(true);
    setUploadProgress(0);
    clearErrors();

    try {
      // Step 1: Get upload signature from backend
      const signatureResponse = await axiosClient.get(
        `/video/create/${problemId}`,
      );
      const {
        signature,
        timestamp,
        public_id,
        api_key,
        cloud_name,
        upload_url,
      } = signatureResponse.data;

      // Step 2: Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp);
      formData.append("public_id", public_id);
      formData.append("api_key", api_key);

      // Step 3: Upload directly to Cloudinary
      const uploadResponse = await axios.post(upload_url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(progress);
        },
      });

      const cloudinaryResult = uploadResponse.data;

      // Step 4: Save video metadata to backend
      const metadataResponse = await axiosClient.post("/video/save", {
        problemId: problemId,
        cloudinaryPublicId: cloudinaryResult.public_id,
        secureUrl: cloudinaryResult.secure_url,
        duration: cloudinaryResult.duration,
      });

      setUploadedVideo(metadataResponse.data.videoSolution);
      reset(); // Reset form after successful upload
    } catch (err) {
      console.error("Upload error:", err);
      setError("root", {
        type: "manual",
        message:
          err.response?.data?.message || "Upload failed. Please try again.",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm">
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Upload Video Solution
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* File Input */}
            <div className="form-control w-full">
              <label className="label pb-1">
                <span className="label-text font-medium">
                  Choose video file
                </span>
                <span className="label-text-alt text-base-content/50">
                  Max 100MB
                </span>
              </label>
              <input
                type="file"
                accept="video/*"
                {...register("videoFile", {
                  required: "Please select a video file",
                  validate: {
                    isVideo: (files) => {
                      if (!files || !files[0])
                        return "Please select a video file";
                      const file = files[0];
                      return (
                        file.type.startsWith("video/") ||
                        "Please select a valid video file"
                      );
                    },
                    fileSize: (files) => {
                      if (!files || !files[0]) return true;
                      const file = files[0];
                      const maxSize = 100 * 1024 * 1024;
                      return (
                        file.size <= maxSize ||
                        "File size must be less than 100MB"
                      );
                    },
                  },
                })}
                className={`file-input file-input-bordered w-full ${
                  errors.videoFile ? "file-input-error" : ""
                }`}
                disabled={uploading}
              />
              {errors.videoFile && (
                <p className="text-error text-xs mt-1">
                  {errors.videoFile.message}
                </p>
              )}
            </div>

            {/* Selected File */}
            {selectedFile && (
              <div className="rounded-xl bg-base-200 p-4 text-sm">
                <p className="font-medium mb-1">Selected file</p>
                <p className="truncate">{selectedFile.name}</p>
                <p className="text-base-content/60">
                  Size: {formatFileSize(selectedFile.size)}
                </p>
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Uploading…</span>
                  <span>{uploadProgress}%</span>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={uploadProgress}
                  max="100"
                ></progress>
              </div>
            )}

            {/* Error */}
            {errors.root && (
              <div className="alert alert-error rounded-xl">
                <span className="text-sm">{errors.root.message}</span>
              </div>
            )}

            {/* Success */}
            {uploadedVideo && (
              <div className="alert alert-success rounded-xl">
                <div className="text-sm">
                  <p className="font-semibold mb-1">Upload successful</p>
                  <p>Duration: {formatDuration(uploadedVideo.duration)}</p>
                  <p className="text-base-content/70">
                    Uploaded:{" "}
                    {new Date(uploadedVideo.uploadedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={uploading}
                className={`btn btn-primary w-full h-11 text-base font-semibold ${
                  uploading ? "loading btn-disabled" : ""
                }`}
              >
                {uploading ? "Uploading…" : "Upload Video"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminUpload;
