# Rate Limits, Booking Rules, and Upload Validation

Date: 2026-03-19

## Purpose

This note explains three different ideas that are easy to mix up:

1. rate limiting
2. business validation
3. duplicate-file detection

They solve different problems. A production app usually needs all three.

## 1. Rate Limiting

Rate limiting answers this question:

"Is this client sending too many requests in a short time?"

Examples:

- one person clicks "احجز" many times
- a bot sends many booking requests
- an admin page keeps asking for upload URLs too fast
- a client script tries to delete many files in a burst

Rate limiting does not decide whether a request is logically valid. It only decides whether the request volume is acceptable.

### Why it matters

- protects the app from spam and brute-force behavior
- reduces accidental duplicate submissions
- limits infrastructure cost
- protects storage and notification systems from abuse

### In this project

The current limiter is DB-backed. That means:

- the state lives in Postgres
- multiple app instances see the same counters
- the limit is not lost when one server process restarts

## 2. Booking Business Validation

Business validation answers this question:

"Should this booking be allowed at all?"

Examples:

- same car should not book the same day twice
- a date in the past should be rejected
- a fully booked day should reject new bookings
- a service may only be available on certain days

This is different from rate limiting.

### Example

A request can:

- pass the rate limit
- but still fail business validation

That is normal.

For example:

- the user sends only one request, so rate limiting allows it
- but the car already has an active booking for that date, so booking validation should reject it

### Practical rule

Use:

- rate limiting for abuse control
- business validation for correctness

Do not replace one with the other.

## 3. Upload Validation

Upload validation answers this question:

"Is this file safe and acceptable to upload?"

Examples:

- file type is allowed
- file size is allowed
- filename format is acceptable
- the current user has permission to upload

Your current upload route already does part of this:

- admin auth check
- file metadata validation
- signed URL generation

## 4. Duplicate Image Detection

Duplicate image detection answers this question:

"Is this image already stored, and should we stop uploading it again?"

This is not the same as rate limiting.

### Important distinction

Rate limiting:

- cares about request frequency

Duplicate detection:

- cares about file identity or file similarity

You can have:

- a single upload request that is a duplicate image
- many upload requests that are all different images

Those are different problems.

## 5. Should Upload Reject an Already Existing Image?

Maybe. It depends on product rules.

### Option A: Allow duplicates

Best when:

- repeated uploads are harmless
- the same image may belong to multiple records
- simplicity matters more than storage cleanliness

Pros:

- simplest implementation
- no false positives

Cons:

- wastes storage
- makes gallery management messier

### Option B: Reject exact duplicates

Best when:

- you want to save storage
- the same binary file should never be uploaded twice

How it works:

- compute a content hash such as SHA-256
- store the hash in the database
- before accepting a new upload, check whether the same hash already exists

Pros:

- reliable for exact file duplicates
- easy to reason about

Cons:

- does not catch resized or recompressed versions of the same image

### Option C: Detect visually similar duplicates

Best when:

- you care about near-duplicate photos

How it works:

- compute a perceptual hash, not just a binary hash

Pros:

- can catch images that look the same but are not byte-for-byte identical

Cons:

- more complex
- may produce false positives
- usually unnecessary for an MVP admin dashboard

## 6. Best Practice for This App

For this project, the practical order is:

1. keep rate limiting on upload URL generation and delete paths
2. keep file type and size validation
3. if storage cleanliness matters, add exact duplicate detection with a content hash
4. only add perceptual duplicate detection if the product really needs it

That is the best cost/benefit path.

## 7. Recommended Upload Flow

If you want exact duplicate protection, a solid flow looks like this:

1. client selects a file
2. server checks auth and rate limit
3. server checks metadata: type and size
4. server computes or receives a hash for the file
5. server checks whether that hash already exists
6. if it exists:
   return the existing file URL or reject the upload
7. if it does not exist:
   issue a signed URL
8. after upload succeeds:
   store the file record with its hash

## 8. Important Design Choice

If a duplicate is found, decide one of these behaviors explicitly:

- reject with an error such as "هذه الصورة موجودة بالفعل"
- return the existing URL and reuse it

Reusing the existing URL is often better than hard rejection because it avoids duplicate storage without breaking the admin workflow.

## 9. Why Rate Limit Still Matters for Uploads

Even if you add duplicate-image detection, rate limiting is still useful.

Why:

- a client can still spam many different files
- signed URL generation still costs requests and server work
- delete endpoints can still be abused
- duplicate detection does not stop burst traffic

So the rule is:

- duplicate detection protects storage quality
- rate limiting protects system stability

## 10. What To Add Next If You Want Stronger Upload Protection

The next useful improvement would be exact duplicate detection based on a file hash.

That would require:

- a file metadata table in the database
- a stored hash column
- a unique index on the hash if you want strict deduplication
- a small change in the upload flow to check or reuse existing files

## Final Summary

Use these layers together:

- rate limit: stops abuse and bursts
- business validation: stops invalid actions
- upload validation: stops bad files
- duplicate detection: stops repeated storage of the same file

They are complementary. One does not replace the others.
