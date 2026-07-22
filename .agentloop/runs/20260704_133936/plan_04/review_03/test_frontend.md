# test-frontend

returncode: 0
seconds: 8.99
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

 ✓ src/api/client.test.ts  (5 tests) 36ms
 ✓ src/store/stores.test.ts  (8 tests) 74ms
 ✓ src/app/RoleGuard.test.tsx  (5 tests) 227ms
 ✓ src/components/ui/Pagination.test.tsx  (4 tests) 451ms
 ✓ src/components/ui/DataTable.test.tsx  (6 tests) 490ms
 ✓ src/components/odontogram/Odontogram.test.tsx  (6 tests) 1235ms
 ✓ src/pages/DoctorDetailPage.test.tsx  (1 test) 655ms
 ✓ src/pages/LoginPage.test.tsx  (4 tests) 1091ms
 ✓ src/pages/ReportsPage.test.tsx  (2 tests) 732ms

 Test Files  9 passed (9)
      Tests  41 passed (41)
   Start at  03:05:25
   Duration  8.30s (transform 2.29s, setup 10.13s, collect 8.82s, tests 4.99s, environment 21.68s, prepare 6.64s)


```

## STDERR
```text

```