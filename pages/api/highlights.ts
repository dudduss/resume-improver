// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { Position } from "../../public/schemas";
type Data = {
  name: string;
};

type ResumeHighlightsRequest = {
  resume: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Position[]>
) {
  if (req.method === "POST") {
    const resumeHighlightsRequest = req.body as ResumeHighlightsRequest;
    const today = new Date().toISOString().slice(0, 10);
    const highlights = await getResumeHighlights(
      resumeHighlightsRequest.resume,
      today
    );

    res.status(200).json(highlights);
  }
}

function removeBullets(highlight: string): string {
  const alphaNumericChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const firstChar = highlight.indexOf(alphaNumericChars);
  return highlight.substring(firstChar);
}

function getEndDate(isCurrent: Boolean, date: string): string {
  if (isCurrent) {
    return "Present";
  } else {
    const dateParts = date.split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthName = monthNames[parseInt(month) - 1];
    return `${monthName} ${year}`;
  }
}

function getStartDate(date: string): string {
  const dateParts = date.split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[parseInt(month) - 1];
  return `${monthName} ${year}`;
}

async function getResumeHighlights(
  base64str: string,
  lastModifiedDate: string
): Promise<Position[]> {
  const url = "https://rest.resumeparsing.com/v10/parser/resume";

  const payload = {
    DocumentAsBase64String: base64str,
    DocumentLastModified: lastModifiedDate,
  };

  const headers = {
    accept: "application/json",
    "content-type": "application/json",
    "sovren-accountid": "37306374",
    "sovren-servicekey": "8qWxcGqr0OdDUisjCDNWxWdKrftMQR/fyovdtvwn",
  };

  // send a post request to the url above
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  // convert the response to json
  const responseJson = await response.json();
  const positions = responseJson.Value.ResumeData.EmploymentHistory.Positions;
  var positionsResult = [];

  // loop through positions
  for (var i = 0; i < positions.length; i++) {
    var position = positions[i];
    const isCurrent = position.IsCurrent;

    if (!position.Description) {
      continue;
    }

    const description = position.Description;
    var employerName = "";
    if (position.Employer) {
      employerName = position.Employer.Name.Normalized;
    } else {
      employerName = "Unknown Employer";
    }

    const startDate = getStartDate(position.StartDate.Date);
    const endDate = getEndDate(isCurrent, position.EndDate.Date);

    var title = "";
    if (position.JobTitle) {
      title = position.JobTitle.Normalized;
    } else {
      title = "Unknown Title";
    }

    const highlights = description.split("\n");
    const filteredHighlights = highlights.filter(
      (highlight: String) => highlight.length > 20
    );

    const highlightsWithoutBullets = filteredHighlights.map(removeBullets);

    var positionResult = {
      title: title,
      employerName: employerName,
      startDate: startDate,
      endDate: endDate,
      highlights: highlightsWithoutBullets,
    };
    positionsResult.push(positionResult);
  }

  return positionsResult;
}
