# test-frontend

returncode: 0
seconds: 5.96
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

 ✓ src/api/client.test.ts  (5 tests) 19ms
 ✓ src/store/stores.test.ts  (8 tests) 32ms
 ✓ src/app/RoleGuard.test.tsx  (5 tests) 127ms
 ✓ src/components/ui/Pagination.test.tsx  (4 tests) 223ms
 ✓ src/components/ui/DataTable.test.tsx  (6 tests) 255ms
 ✓ src/components/odontogram/Odontogram.test.tsx  (6 tests) 577ms
 ✓ src/pages/DoctorDetailPage.test.tsx  (1 test) 303ms
 ✓ src/pages/LoginPage.test.tsx  (4 tests) 543ms
 ✓ src/pages/ReportsPage.test.tsx  (2 tests) 329ms

 Test Files  9 passed (9)
      Tests  41 passed (41)
   Start at  01:57:03
   Duration  4.91s (transform 1.20s, setup 5.69s, collect 4.12s, tests 2.41s, environment 13.22s, prepare 6.43s)


```

## STDERR
```text

```