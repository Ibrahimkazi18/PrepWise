import { getFeedbackByInterviewid } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Link from "next/link";
import dayjs from "dayjs";

const FeedbackHistory = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const allFeedback = await getFeedbackByInterviewid({
    interviewId: id,
    userId: user?.id!,
  });

  if (!allFeedback || allFeedback.length === 0) {
    return (
      <div>
        <h1>No feedback records found</h1>
        <Link href={`/interview/${id}/feedback`}>Back to Latest Feedback</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Feedback History</h1>
      <ul className="space-y-4">
        {allFeedback.map((feedback) => (
          <li key={feedback.id} className="border p-4 rounded-lg">
            <p>
              <strong>Date:</strong>{" "}
              {dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")}
            </p>
            <p>
              <strong>Total Score:</strong> {feedback.totalScore}/100
            </p>
            <p>
              <strong>Final Assessment:</strong> {feedback.finalAssessment}
            </p>
            <Link href={`/interview/${id}/feedback/${feedback.id}`} className="text-blue-500 mt-2 block">
              View Full Feedback
            </Link>
          </li>
        ))}
      </ul>
      <Link href={`/interview/${id}/feedback`} className="mt-4 inline-block text-blue-500">
        Back to Latest Feedback
      </Link>
    </div>
  );
};

export default FeedbackHistory;