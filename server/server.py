from flask import Flask, jsonify, request, abort, make_response
from db import initDb, validateJSON
import json
import re
from dateutil.parser import parse as parseDate
from bson import json_util
from jsonschema.exceptions import ValidationError
from bson.objectid import ObjectId
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

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

@app.route("/addNewStudents", methods=['POST'])
def addNewStudents():
    student = request.json
    studentCollection = demoDB['students']
    print(student)
    try: 
       validateJSON(student, 'students')
    except ValueError:
       abort(500, 'Internal data validation error')
    except ValidationError:
       abort(400, 'Invalid JSON format')

    dob = student['dob']

    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', student['email']):
       abort(400, 'Incorrect email format')

    try:
        datetime.date.fromisoformat(dob)
    except ValueError:
        abort(400, 'Incorrect date format for date of birth, should be YYYY-MM-DD')

    # check if there's a duplicate entry in DB
    existingEntries = studentCollection.find_one({ "email": student['email'] })

    if not existingEntries:
       studentCollection.insert_one(student)
    else:
       abort(400, 'Student email already exists')
    return make_response({"status": "success"}, 200)

@app.route("/removeStudent", methods=['DELETE'])
def removeStudent():
    student = request.json
    studentCollection = demoDB['students']
    resultCollection = demoDB['results']

    print(student)
    try: 
       validateJSON(student, 'studentID')
    except ValueError:
       abort(500, 'Internal data validation error')
    except ValidationError:
       abort(400, 'Invalid JSON format')

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
       abort(400, 'Student does not exist')

    return make_response({"status": "success"}, 200)

@app.route("/getStudentsList", methods=['GET'])
def getStudentsList():
    students = []

    for student in demoDB['students'].find():
        students.append(formatJson(student))

    print(students)

    return jsonify(students)

@app.route("/addNewCourse", methods=['POST'])
def addNewCourse():
    collectionType = 'courses'
    course = request.json
    coursesCollection = demoDB[collectionType]
    print(course)
    try: 
       validateJSON(course, collectionType)
    except ValueError:
       abort(500, 'Internal data validation error')
    except ValidationError:
       abort(400, 'Invalid JSON format')

    # check if there's a duplicate entry in DB
    existingEntry = coursesCollection.find_one({ "courseName": course['courseName'] })

    if not existingEntry:
       coursesCollection.insert_one(course)
    else:
       abort(400, "Course {} already exists".format(course['courseName']))
    return make_response({"status": "success"}, 200)

@app.route("/removeCourse", methods=['DELETE'])
def removeCourse():
    course = request.json
    coursesCollection = demoDB['courses']
    resultCollection = demoDB['results']

    print(course)
    try: 
       validateJSON(course, 'courseID')
    except ValueError:
       abort(500, 'Internal data validation error')
    except ValidationError:
       abort(400, 'Invalid JSON format')

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
       abort(400, "Course does not exist")
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
    print(result)
    try: 
       validateJSON(result, collectionType)
    except ValueError:
       abort(500, 'Internal data validation error')
    except ValidationError:
       abort(400, 'Invalid JSON format')
    
    courseID = result['courseID']
    studentID = result['studentID']

    if not re.match(r'([a-f\d]{24})', courseID):
       abort(400, 'Incorrect courseID format')

    if not re.match(r'([a-f\d]{24})', result['studentID']):
       abort(400, 'Incorrect studentID format')

    if not re.match(r'([A-F])', result['result']):
       abort(400, 'Incorrect result value')

    # check if there's a duplicate entry in DB
    existingEntry = resultsCollection.find_one({ "courseID": courseID, "studentID": studentID })

    # check if student exists
    if not studentCollection.find_one({"_id": ObjectId(studentID)}):
       abort(400, 'Student does not exist')

    # check if course exists
    if not coursesCollection.find_one({"_id": ObjectId(courseID)}):
       abort(400, 'Course does not exist')

    if not existingEntry:
       resultsCollection.insert_one(result)
    else:
       abort(400, 'Result already exists')
    return make_response({"status": "success"}, 200)

@app.route("/getResultList", methods=['GET'])
def getResultList():
    results = []

    for result in demoDB['results'].find():
        results.append(formatJson(result))

    return jsonify(results)

if __name__ == '__main__':
   app.run(debug=True)