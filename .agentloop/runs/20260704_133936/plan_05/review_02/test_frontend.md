# test-frontend

returncode: 0
seconds: 3.51
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

 ✓ src/api/client.test.ts  (5 tests) 10ms
 ✓ src/store/stores.test.ts  (8 tests) 19ms
 ✓ src/app/RoleGuard.test.tsx  (5 tests) 67ms
 ✓ src/components/ui/Pagination.test.tsx  (4 tests) 121ms
 ✓ src/components/ui/DataTable.test.tsx  (6 tests) 158ms
 ✓ src/components/odontogram/Odontogram.test.tsx  (6 tests) 415ms
 ✓ src/components/ErrorBoundary.test.tsx  (6 tests) 385ms
 ✓ src/pages/DoctorDetailPage.test.tsx  (1 test) 215ms
 ✓ src/pages/LoginPage.test.tsx  (4 tests) 415ms
 ✓ src/pages/ReportsPage.test.tsx  (2 tests) 313ms

 Test Files  10 passed (10)
      Tests  47 passed (47)
   Start at  15:41:25
   Duration  3.07s (transform 1.12s, setup 3.71s, collect 3.51s, tests 2.12s, environment 8.68s, prepare 3.08s)


```

## STDERR
```text

```