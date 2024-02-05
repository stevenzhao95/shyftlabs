from flask import Flask, jsonify, request, abort, make_response
from db import initDb, validateJSON
import json
import re
from dateutil.parser import parse as parseDate
from bson import json_util
from jsonschema.exceptions import ValidationError
from bson.objectid import ObjectId
from flask_cors import CORS
from flask import Flask
from flask_swagger_ui import get_swaggerui_blueprint
import datetime

app = Flask(__name__)
CORS(app)

SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.yaml'

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Student Result Management System API"
    }
)

app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

demoDB = initDb()

def is_json(myjson):
  try:
    json.loads(myjson)
  except ValueError as e:
    return False
  return True

def formatJson(data):
    parsedJson = json.loads(json_util.dumps(data))
    mongoId = parsedJson['_id']["$oid"]
    if mongoId:
       del parsedJson['_id']
    parsedJson['id'] = mongoId
    return parsedJson

def sendJSONErrorResponse(errorCode, errorMsg):
   return abort(make_response(jsonify(message=errorMsg), errorCode))

@app.route("/addNewStudents", methods=['POST'])
def addNewStudents():
    student = request.json
    studentCollection = demoDB['students']
    try: 
       validateJSON(student, 'students')
    except ValueError:
       sendJSONErrorResponse(500, 'Internal data validation error')
    except ValidationError:
       sendJSONErrorResponse(400, 'Invalid JSON format')

    dob = student['dob']

    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', student['email']):
       sendJSONErrorResponse(400, 'Incorrect email format')

    try:
        datetime.date.fromisoformat(dob)
    except ValueError:
        sendJSONErrorResponse(400, 'Incorrect date format for date of birth, should be YYYY-MM-DD')

    # check if there's a duplicate entry in DB
    existingEntries = studentCollection.find_one({ "email": student['email'] })

    if not existingEntries:
       studentCollection.insert_one(student)
    else:
       sendJSONErrorResponse(400, 'Student email already exists')
    return make_response({"status": "success"}, 200)

@app.route("/removeStudent", methods=['DELETE'])
def removeStudent():
    student = request.json
    studentCollection = demoDB['students']
    resultCollection = demoDB['results']

    try: 
       validateJSON(student, 'studentID')
    except ValueError:
       sendJSONErrorResponse(500, 'Internal data validation error')
    except ValidationError:
       sendJSONErrorResponse(400, 'Invalid JSON format')

    studentID = student['studentID']

    # Remove all results for this student if any
    existingResult = resultCollection.find_one({"studentID": studentID})
    if existingResult:
       resultCollection.delete_many({"studentID": studentID})

    # check if there's an existing entry in DB
    existingEntry = studentCollection.find_one({"_id": ObjectId(studentID)})

    if existingEntry:
       studentCollection.delete_one({"_id": ObjectId(studentID)})
    else:
       sendJSONErrorResponse(404, 'Student does not exist')

    return make_response({"status": "success"}, 200)

@app.route("/getStudentsList", methods=['GET'])
def getStudentsList():
    students = []

    for student in demoDB['students'].find():
        students.append(formatJson(student))

    return jsonify(students)

@app.route("/addNewCourse", methods=['POST'])
def addNewCourse():
    collectionType = 'courses'
    course = request.json
    coursesCollection = demoDB[collectionType]

    try: 
       validateJSON(course, collectionType)
    except ValueError:
       sendJSONErrorResponse(500, 'Internal data validation error')
    except ValidationError:
       sendJSONErrorResponse(400, 'Invalid JSON format')

    # check if there's a duplicate entry in DB
    existingEntry = coursesCollection.find_one({ "courseName": course['courseName'] })

    if not existingEntry:
       coursesCollection.insert_one(course)
    else:
       sendJSONErrorResponse(400, "Course {} already exists".format(course['courseName']))
    return make_response({"status": "success"}, 200)

@app.route("/removeCourse", methods=['DELETE'])
def removeCourse():
    course = request.json
    coursesCollection = demoDB['courses']
    resultCollection = demoDB['results']

    try: 
       validateJSON(course, 'courseID')
    except ValueError:
       sendJSONErrorResponse(500, 'Internal data validation error')
    except ValidationError:
       sendJSONErrorResponse(400, 'Invalid JSON format')

    courseID = course['courseID']

    # Remove all results for this student if any
    existingResult = resultCollection.find_one({"courseID": courseID})
    if existingResult:
       resultCollection.delete_many({"courseID": courseID})

    # check if there's a duplicate entry in DB
    existingEntry = coursesCollection.find_one({"_id": ObjectId(courseID)})

    if existingEntry:
       coursesCollection.delete_one({"_id": ObjectId(courseID)})
    else:
       sendJSONErrorResponse(404, "Course does not exist")
    return make_response({"status": "success"}, 200)

@app.route("/getCoursesList", methods=['GET'])
def getCoursesList():
    courses = []

    for course in demoDB['courses'].find():
        courses.append(formatJson(course))

    return jsonify(courses)

@app.route("/addNewResult", methods=['POST'])
def addNewResult():
    collectionType = 'results'
    result = request.json
    resultsCollection = demoDB[collectionType]
    coursesCollection = demoDB['courses']
    studentCollection = demoDB['students']

    try: 
       validateJSON(result, collectionType)
    except ValueError:
       sendJSONErrorResponse(500, 'Internal data validation error')
    except ValidationError:
       sendJSONErrorResponse(400, 'Invalid JSON format')
    
    courseID = result['courseID']
    studentID = result['studentID']

    if not re.match(r'([a-f\d]{24})', courseID):
       sendJSONErrorResponse(400, 'Incorrect courseID format')

    if not re.match(r'([a-f\d]{24})', result['studentID']):
       sendJSONErrorResponse(400, 'Incorrect studentID format')

    if not re.match(r'([A-F])', result['result']):
       sendJSONErrorResponse(400, 'Incorrect result value')

    # check if there's a duplicate entry in DB
    existingEntry = resultsCollection.find_one({ "courseID": courseID, "studentID": studentID })

    # check if student exists
    if not studentCollection.find_one({"_id": ObjectId(studentID)}):
       sendJSONErrorResponse(404, 'Student does not exist')

    # check if course exists
    if not coursesCollection.find_one({"_id": ObjectId(courseID)}):
       sendJSONErrorResponse(404, 'Course does not exist')

    if not existingEntry:
       resultsCollection.insert_one(result)
    else:
       sendJSONErrorResponse(400, 'Result already exists')
    return make_response({"status": "success"}, 200)

@app.route("/getResultList", methods=['GET'])
def getResultList():
    results = []

    for result in demoDB['results'].find():
        results.append(formatJson(result))

    return jsonify(results)

if __name__ == '__main__':
   app.run(debug=True)