export const downloadFile = (fileUrl: string) => {
	const link = document.createElement("a");
	link.href = fileUrl;
	link.target = '_blank';
	link.download = <string>fileUrl.split("/").pop(); // Extracts file name from URL
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};