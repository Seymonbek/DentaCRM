# test-frontend

returncode: 0
seconds: 3.32
timed_out: False

## Command
```text
bash -lc npm run test -- --run
```

## STDOUT
```text

> dentacrm-frontend@0.1.0 test
> vitest run --run


 RUN  v2.1.1 /home/seymonbek/Downloads/ai-orchestrator-template-main/ai-orchestrator-template-main/dentacrm/frontend

 ✓ src/api/client.test.ts  (5 tests) 12ms
 ✓ src/store/stores.test.ts  (8 tests) 19ms
 ✓ src/app/RoleGuard.test.tsx  (5 tests) 98ms
 ✓ src/components/ui/Pagination.test.tsx  (4 tests) 104ms
 ✓ src/components/ui/DataTable.test.tsx  (6 tests) 134ms
 ✓ src/components/odontogram/Odontogram.test.tsx  (6 tests) 411ms
 ✓ src/pages/DoctorDetailPage.test.tsx  (1 test) 223ms
 ✓ src/pages/LoginPage.test.tsx  (4 tests) 415ms
 ✓ src/pages/ReportsPage.test.tsx  (2 tests) 266ms

 Test Files  9 passed (9)
      Tests  41 passed (41)
   Start at  10:48:19
   Duration  2.88s (transform 703ms, setup 3.14s, collect 2.60s, tests 1.68s, environment 7.29s, prepare 2.97s)


```

## STDERR
```text

```