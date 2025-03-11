export async function liveAnalysis() {
  const video = document.createElement('video');
  video.style.display = 'none';
  document.body.appendChild(video);

  // Request access to the webcam
  const stream = await navigator.mediaDevices.getUserMedia({video: true});
  video.srcObject = stream;
   
  await video.play();

  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
  if (!(blob))
    throw new Error('Failed to capture frame.');
  
  const formData = new FormData();
  formData.append('file', blob, 'frame.jpg');
  
  const response = await fetch('http://localhost:8000/live.predict', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error processing image');
  }
  
  return await response.json();
}
  