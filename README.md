# Setu API Integration Assignment - Completed

This project fulfills the Setu API integration assignment, covering all three stages:

- **Stage 1:** Tested Setu sandbox APIs using Postman, including document upload, signature initiation, status check, and document download.  
- **Stage 2:** Built a frontend-only React app where users can enter API credentials (saved in localStorage), upload PDFs, initiate signature requests, check signature status, and download signed documents.  
- **Stage 3:** Enhanced the UI/UX with a clean, modern design, upload progress indicators, and status polling until signature completion.

---

## Key Precautions & Notes

- API credentials (`x-client-id`, `x-client-secret`, `x-product-instance-id`) are stored in localStorage for simplicity but this is **insecure** in production environments.  
- All API calls are made directly from the frontend, which may expose secrets and cause CORS issues. In real-world scenarios, proxying via a backend or serverless functions is recommended.  
- File uploads are validated for type and size before submission.  
- Clear UI feedback is provided for upload progress, success, and error states.

---

## Project Status

The project is deployed and fully functional. Source code is available in this repository.

---

Thank you for reviewing my submission!
