import api from "./api";

const inspectionPhotoService = {
  async getAll(inspectionRequestId) {
    return api.get(
      `/api/inspection-requests/${inspectionRequestId}/photos`
    );
  },

  async upload(inspectionRequestId, photo, description = "") {
    const formData = new FormData();

    formData.append("photo", photo);

    if (description) {
      formData.append("description", description);
    }

    return api.post(
      `/api/inspection-requests/${inspectionRequestId}/photos`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  async uploadForReport(inspectionReportId, photo, description = "") {
    const formData = new FormData();

    formData.append("photo", photo);

    if (description) {
      formData.append("description", description);
    }

    return api.post(
      `/api/inspection-reports/${inspectionReportId}/photos`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  async remove(photoId) {
    return api.delete(`/api/inspection-photos/${photoId}`);
  },
};

export default inspectionPhotoService;