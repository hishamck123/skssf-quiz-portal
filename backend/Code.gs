// CONFIGURATION: Define your correct answers here.
// The keys should match the question IDs (e.g., "q1", "q2") from your frontend.
var CORRECT_ANSWERS = {
  "q1": "മുഹമ്മദ് ﷺ",
  "q2": "റമദാൻ",
  "q3": "അബൂബക്കർ (റ)",
  "q4": "അൽ-ഫാത്തിഹ",
  "q5": "5",
  "q6": "മക്ക",
  "q7": "ഖിബ്ല",
  "q8": "മക്ക",
  "q9": "ഈദുൽ ഫിത്വർ",
  "q10": "4",
  "q11": "114",
  "q12": "മക്ക",
  "q13": "മദീന",
  "q14": "അബ്ദുല്ല",
  "q15": "ആമിന",
  "q16": "ഖദീജ",
  "q17": "ഹിറ",
  "q18": "ഇഖ്‌റഅ്",
  "q19": "അദാൻ",
  "q20": "ദരിദ്രർ",
  "q21": "5",
  "q22": "മലക്ക്",
  "q23": "2 ഹി.",
  "q24": "3 ഹി.",
  "q25": "30",
  "q26": "4",
  "q27": "ബഖറ",
  "q28": "കൗസർ",
  "q29": "7",
  "q30": "ഖദീജ",
  "q31": "അബൂബക്കർ",
  "q32": "അലി",
  "q33": "ഫാത്തിമ",
  "q34": "മർയം",
  "q35": "ചന്ദ്രൻ",
  "q36": "വെള്ളി",
  "q37": "തവാഫ്",
  "q38": "സഅ്‌യ്",
  "q39": "വുകൂഫ്",
  "q40": "ഖുർബാനി",
  "q41": "അറബി",
  "q42": "കഅ്ബ",
  "q43": "നബിയെ കണ്ട വിശ്വാസി",
  "q44": "ലൈലത്തുൽ ഖദർ",
  "q45": "30",
  "q46": "99",
  "q47": "തക്ബീർ",
  "q48": "ശഹാദത്ത്",
  "q49": "റമദാൻ"
};

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    var name = data.name || "";
    var registerNumber = data.registerNumber || "";
    var referenceNumber = data.referenceNumber || "";
    var phone = data.phone || "";
    var email = data.email || "";
    var submittedAt = data.submittedAt || new Date().toISOString();
    var answers = data.answers || {};
    
    // Calculate Score
    var score = 0;
    var answers = data.answers || {};
    
    var questionKeys = Object.keys(answers).sort();
    for (var i = 0; i < questionKeys.length; i++) {
      var qId = questionKeys[i];
      var studentAnswer = answers[qId];
      
      if (CORRECT_ANSWERS[qId]) {
        if (studentAnswer === CORRECT_ANSWERS[qId]) {
          score += 2; // Correct answer
        } else if (studentAnswer.trim() !== "") {
          score -= 1; // Wrong answer (Negative marking)
        }
        // If unanswered (empty string), score remains unchanged (0 marks)
      }
    }

    // Build row data
    // Assuming columns: Timestamp, Reference Number, Register Number, Name, Phone, Email, Score, q1, q2, ..., q49
    var rowData = [submittedAt, referenceNumber, registerNumber, name, phone, email, score];
    
    // Since questions are randomized (30 out of 49), we MUST output them in a fixed order 
    // so the columns align correctly in the Google Sheet for every student.
    // We will iterate from 1 to 49. If a student didn't get a question, the cell will be blank.
    for (var i = 1; i <= 49; i++) {
      var key = "q" + i;
      rowData.push(answers[key] || "");
    }
    
    // Optional: Prevent duplicate submissions based on Register Number
    var dataRange = sheet.getDataRange().getValues();
    for (var j = 1; j < dataRange.length; j++) { // Skip header row
      // Register Number is now at index 2 (Column C) in rowData, but it depends on sheet structure.
      // Assuming Sheet matches rowData: 0=Timestamp, 1=Ref, 2=RegNum
      if (dataRange[j][2] == registerNumber) {
        return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": "Duplicate Register Number"}))
                             .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Provide a doGet to easily check if the script is running
function doGet(e) {
  return ContentService.createTextOutput("SKSSF Muttipadi Quiz Backend is Running.");
}
