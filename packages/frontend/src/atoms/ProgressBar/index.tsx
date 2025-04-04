import React from "react";

type ProgressBarProps = {
	progressValue: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ progressValue }) => {
	const safeValue = Math.max(0, Math.min(100, progressValue));

	return (
		<>
			<div
				className="w-full h-1 rounded overflow-hidden my-2 position-relative"
				style={{ backgroundColor: "#e0e0e0" }}
			>
				<div className="h-full bg-red" style={{ width: `${safeValue}%`, height: "12px" }} />
				<div
					className="position-absolute text-black font-weight-bold"
					style={{ top: "0px", left: "45%", fontSize: "0.5rem" }}
				>
					{parseFloat(progressValue.toPrecision(2))}
				</div>
			</div>
		</>
	);
};
